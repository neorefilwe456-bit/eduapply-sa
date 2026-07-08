"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import type { TicketStatus } from "@/types/database.types";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  created_at: string;
  student: { first_name: string; last_name: string; email: string } | null;
};

const STATUS_OPTIONS: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

export default function AdminSupportPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");

  async function load() {
    let query = supabase
      .from("support_tickets")
      .select("id, subject, message, status, created_at, student:profiles!support_tickets_student_id_fkey(first_name, last_name, email)")
      .order("created_at", { ascending: false });
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data } = await query;
    setTickets((data as unknown as Ticket[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateStatus(id: string, status: TicketStatus) {
    await supabase.from("support_tickets").update({ status }).eq("id", id);
    load();
  }

  if (loading) return <p className="text-muted-foreground">Loading tickets…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Support Tickets</h1>
        <p className="text-muted-foreground">Respond to and manage student support requests.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "")}
            className="flex h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.student ? `${t.student.first_name} ${t.student.last_name} (${t.student.email})` : "Unknown student"} ·{" "}
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value as TicketStatus)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.message}</p>
            </CardContent>
          </Card>
        ))}
        {tickets.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No tickets match this filter.</p>
        )}
      </div>
    </div>
  );
}
