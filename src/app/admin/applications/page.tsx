"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ApplicationStatus, ApplicationType } from "@/types/database.types";
import { ChevronDown, ChevronUp } from "lucide-react";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "draft", "awaiting_documents", "awaiting_payment", "payment_verified",
  "submitted", "processing", "accepted", "rejected", "completed",
];

type Row = {
  id: string;
  application_type: ApplicationType;
  status: ApplicationStatus;
  assigned_consultant_id: string | null;
  created_at: string;
  timeline: { status: string; timestamp: string; note?: string }[];
  student: { first_name: string; last_name: string } | null;
  institutions: { name: string } | null;
  bursaries: { name: string } | null;
};

type StaffMember = { id: string; first_name: string; last_name: string };

export default function AdminApplicationsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, { note: string; created_at: string }[]>>({});

  async function loadApplications() {
    const { data } = await supabase
      .from("applications")
      .select(
        "id, application_type, status, assigned_consultant_id, created_at, timeline, student:profiles!applications_student_id_fkey(first_name, last_name), institutions(name), bursaries(name)"
      )
      .order("created_at", { ascending: false });
    setRows((data as unknown as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      const { data: staffData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("role", ["admin", "super_admin", "consultant"]);
      setStaff((staffData as StaffMember[]) ?? []);
      loadApplications();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(row: Row, newStatus: ApplicationStatus) {
    const newTimeline = [
      ...(row.timeline ?? []),
      { status: newStatus, timestamp: new Date().toISOString(), note: "Status updated by admin" },
    ];
    await supabase.from("applications").update({ status: newStatus, timeline: newTimeline }).eq("id", row.id);
    loadApplications();
  }

  async function assignConsultant(row: Row, consultantId: string) {
    await supabase.from("applications").update({ assigned_consultant_id: consultantId || null }).eq("id", row.id);
    loadApplications();
  }

  async function loadNotes(applicationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("admin_notes")
      .select("note, created_at")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });
    setNotes((n) => ({ ...n, [applicationId]: data ?? [] }));
    void user;
  }

  async function toggleExpand(id: string) {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (!notes[id]) await loadNotes(id);
  }

  async function submitNote(applicationId: string) {
    const note = noteDrafts[applicationId]?.trim();
    if (!note) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("admin_notes").insert({ application_id: applicationId, admin_id: user.id, note });
    setNoteDrafts((d) => ({ ...d, [applicationId]: "" }));
    loadNotes(applicationId);
  }

  const filtered = rows.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (typeFilter && r.application_type !== typeFilter) return false;
    return true;
  });

  if (loading) return <p className="text-muted-foreground">Loading applications…</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-muted-foreground">Review, assign, and update the status of every application.</p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All types</option>
            <option value="university">University</option>
            <option value="college">College</option>
            <option value="bursary">Bursary</option>
          </select>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} application{filtered.length === 1 ? "" : "s"}</p>

      <div className="space-y-3">
        {filtered.map((row) => {
          const targetName = row.institutions?.name ?? row.bursaries?.name ?? "—";
          const studentName = row.student ? `${row.student.first_name} ${row.student.last_name}` : "Unknown student";
          const isOpen = expanded === row.id;

          return (
            <Card key={row.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {targetName} · <span className="capitalize">{row.application_type}</span> ·{" "}
                      {new Date(row.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => toggleExpand(row.id)} className="text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(row, e.target.value as ApplicationStatus)}
                    className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>

                  <select
                    value={row.assigned_consultant_id ?? ""}
                    onChange={(e) => assignConsultant(row, e.target.value)}
                    className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                    ))}
                  </select>
                </div>

                {isOpen && (
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    <div>
                      <p className="mb-2 text-sm font-medium">Internal notes (staff only)</p>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={noteDrafts[row.id] ?? ""}
                          onChange={(e) => setNoteDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Add an internal note…"
                        />
                        <Button size="sm" onClick={() => submitNote(row.id)}>Add</Button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {(notes[row.id] ?? []).map((n, i) => (
                          <div key={i} className="rounded-md bg-muted/50 p-2 text-xs">
                            <p>{n.note}</p>
                            <p className="mt-1 text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No applications match your filters.</p>
        )}
      </div>
    </div>
  );
}
