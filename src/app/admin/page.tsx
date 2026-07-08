import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, FileCheck2, LifeBuoy } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [
    { count: studentCount },
    { count: applicationCount },
    { count: pendingDocumentCount },
    { count: openTicketCount },
    { data: statusBreakdown },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("applications").select("status"),
  ]);

  const breakdown: Record<string, number> = {};
  (statusBreakdown ?? []).forEach((a) => {
    breakdown[a.status] = (breakdown[a.status] ?? 0) + 1;
  });

  const stats = [
    { label: "Registered students", value: studentCount ?? 0, icon: Users, color: "text-primary bg-primary/10" },
    { label: "Total applications", value: applicationCount ?? 0, icon: ClipboardList, color: "text-secondary bg-secondary/10" },
    { label: "Documents pending review", value: pendingDocumentCount ?? 0, icon: FileCheck2, color: "text-accent bg-accent/10" },
    { label: "Open support tickets", value: openTicketCount ?? 0, icon: LifeBuoy, color: "text-destructive bg-destructive/10" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-muted-foreground">A snapshot of everything happening on the platform right now.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`rounded-full p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 font-medium">Applications by status</h2>
          {Object.keys(breakdown).length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications have been submitted yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(breakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <span className="capitalize">{status.replace("_", " ")}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
