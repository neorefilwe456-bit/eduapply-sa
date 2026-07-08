import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, School, Award, Bell, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const completion = calculateProfileCompletion(profile);

  // These tables are wired up but populated starting in the next build phase —
  // counts will simply read 0 until applications/documents exist.
  const [{ count: applicationCount }, { count: documentCount }, { data: notifications }] =
    await Promise.all([
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("student_id", user.id),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("student_id", user.id),
      supabase
        .from("notifications")
        .select("id, title, message, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {profile?.first_name ?? "there"} 👋</h1>
        <p className="text-muted-foreground">Here's where things stand today.</p>
      </div>

      {completion < 100 && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Your profile is {completion}% complete</p>
              <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted sm:w-64">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="gap-2">
                Complete profile <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-3">
              <School className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{applicationCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Applications in progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-secondary/10 p-3">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{documentCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Documents uploaded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-accent/10 p-3">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-semibold">0</p>
              <p className="text-sm text-muted-foreground">Bursaries applied</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application status</CardTitle>
            <CardDescription>You haven't started an application yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/applications/university">
              <Button className="gap-2">
                Browse universities <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" /> Recent notifications
              </CardTitle>
              <CardDescription>Stay on top of updates to your applications.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {notifications && notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id} className="text-sm">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted-foreground">{n.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No notifications yet — you'll see updates here as soon as something changes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
