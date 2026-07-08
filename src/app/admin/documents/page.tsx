"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_TYPES } from "@/lib/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DocumentStatus } from "@/types/database.types";
import { Eye, CheckCircle2, XCircle } from "lucide-react";

type Row = {
  id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  status: DocumentStatus;
  uploaded_at: string;
  student: { first_name: string; last_name: string } | null;
};

const LABELS = Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.type, d.label]));

export default function AdminDocumentsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "">("pending");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  async function load() {
    let query = supabase
      .from("documents")
      .select("id, document_type, file_path, file_name, status, uploaded_at, student:profiles!documents_student_id_fkey(first_name, last_name)")
      .order("uploaded_at", { ascending: false });
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data } = await query;
    setRows((data as unknown as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handlePreview(path: string) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function handleApprove(id: string) {
    await supabase.from("documents").update({ status: "approved", reviewed_at: new Date().toISOString(), admin_notes: null }).eq("id", id);
    load();
  }

  async function handleReject(id: string) {
    const note = noteDrafts[id]?.trim();
    if (!note) {
      alert("Add a note explaining why this document was rejected before rejecting it.");
      return;
    }
    await supabase.from("documents").update({ status: "rejected", reviewed_at: new Date().toISOString(), admin_notes: note }).eq("id", id);
    load();
  }

  if (loading) return <p className="text-muted-foreground">Loading documents…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Document Review</h1>
        <p className="text-muted-foreground">Approve or reject documents uploaded by students.</p>
      </div>

      <Card>
        <CardContent className="flex gap-3 pt-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "")}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{rows.length} document{rows.length === 1 ? "" : "s"}</p>

      <div className="space-y-3">
        {rows.map((row) => (
          <Card key={row.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
              <div>
                <p className="font-medium">
                  {row.student ? `${row.student.first_name} ${row.student.last_name}` : "Unknown student"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {LABELS[row.document_type] ?? row.document_type} · {row.file_name} ·{" "}
                  {new Date(row.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handlePreview(row.file_path)} aria-label="Preview">
                  <Eye className="h-4 w-4" />
                </Button>
                {row.status === "pending" && (
                  <>
                    <input
                      placeholder="Rejection note (required to reject)"
                      value={noteDrafts[row.id] ?? ""}
                      onChange={(e) => setNoteDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                      className="h-9 w-56 rounded-md border border-input bg-background px-2 text-xs"
                    />
                    <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => handleReject(row.id)}>
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => handleApprove(row.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </Button>
                  </>
                )}
                {row.status !== "pending" && (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">{row.status}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No documents match this filter.</p>
        )}
      </div>
    </div>
  );
}
