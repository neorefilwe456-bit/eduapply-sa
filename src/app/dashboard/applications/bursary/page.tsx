"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SA_PROVINCES } from "@/lib/constants";
import { ApplyButton } from "@/components/dashboard/apply-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ApplicationStatus } from "@/types/database.types";
import { Search, Calendar, Award } from "lucide-react";

type Bursary = {
  id: string;
  name: string;
  province: string | null;
  career_field: string | null;
  faculty: string | null;
  closing_date: string | null;
  eligible_grade: string | null;
  nsfas_related: boolean;
  disability_requirement: boolean;
  field_of_study: string | null;
  description: string | null;
};

type AppliedInfo = { status: ApplicationStatus; id: string };

export default function BursaryApplicationsPage() {
  const supabase = createClient();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [applied, setApplied] = useState<Record<string, AppliedInfo>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [nsfasOnly, setNsfasOnly] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setStudentId(user.id);

      const [{ data: burs }, { data: apps }] = await Promise.all([
        supabase.from("bursaries").select("*").order("closing_date"),
        supabase.from("applications").select("id, bursary_id, status").eq("student_id", user.id).eq("application_type", "bursary"),
      ]);

      setBursaries((burs as Bursary[]) ?? []);
      const map: Record<string, AppliedInfo> = {};
      (apps ?? []).forEach((a) => {
        if (a.bursary_id) map[a.bursary_id] = { status: a.status as ApplicationStatus, id: a.id };
      });
      setApplied(map);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const filtered = bursaries.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !(b.field_of_study ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    if (province && b.province && b.province !== province) return false;
    if (nsfasOnly && !b.nsfas_related) return false;
    return true;
  });

  if (!studentId || loading) {
    return <p className="text-muted-foreground">Loading bursaries…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bursary Applications</h1>
        <p className="text-muted-foreground">Browse scholarships, bursaries, and funding opportunities.</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or field…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={province} onChange={(e) => setProvince(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All provinces (incl. national)</option>
            {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={nsfasOnly} onChange={(e) => setNsfasOnly(e.target.checked)} className="h-4 w-4 rounded border-input" />
            NSFAS-related only
          </label>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} bursar{filtered.length === 1 ? "y" : "ies"} found</p>

      <div className="space-y-4">
        {filtered.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold">{b.name}</h3>
                  {b.nsfas_related && <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">NSFAS</span>}
                </div>
                {b.description && <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {b.province && <span>{b.province}</span>}
                  {!b.province && <span>National</span>}
                  {b.closing_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Closes {new Date(b.closing_date).toLocaleDateString()}
                    </span>
                  )}
                  {b.eligible_grade && <span>Grade: {b.eligible_grade}</span>}
                </div>
                {b.field_of_study && (
                  <div className="mt-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{b.field_of_study}</span>
                  </div>
                )}
              </div>
              <div className="shrink-0">
                <ApplyButton
                  studentId={studentId}
                  applicationType="bursary"
                  bursaryId={b.id}
                  existingStatus={applied[b.id]?.status}
                  existingApplicationId={applied[b.id]?.id}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No bursaries match your filters.</p>
        )}
      </div>
    </div>
  );
}
