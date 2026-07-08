"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SA_PROVINCES } from "@/lib/constants";
import { ApplyButton } from "@/components/dashboard/apply-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ApplicationStatus } from "@/types/database.types";
import { Search, MapPin, Calendar } from "lucide-react";

type Institution = {
  id: string;
  name: string;
  province: string | null;
  faculties: string[] | null;
  aps_requirement: number | null;
  closing_date: string | null;
  description: string | null;
};

type AppliedInfo = { status: ApplicationStatus; id: string };

export default function UniversityApplicationsPage() {
  const supabase = createClient();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [applied, setApplied] = useState<Record<string, AppliedInfo>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [faculty, setFaculty] = useState("");
  const [maxAps, setMaxAps] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setStudentId(user.id);

      const [{ data: insts }, { data: apps }] = await Promise.all([
        supabase.from("institutions").select("*").eq("type", "university").order("closing_date"),
        supabase.from("applications").select("id, institution_id, status").eq("student_id", user.id).eq("application_type", "university"),
      ]);

      setInstitutions((insts as Institution[]) ?? []);
      const map: Record<string, AppliedInfo> = {};
      (apps ?? []).forEach((a) => {
        if (a.institution_id) map[a.institution_id] = { status: a.status as ApplicationStatus, id: a.id };
      });
      setApplied(map);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const faculties = useMemo(
    () => Array.from(new Set(institutions.flatMap((i) => i.faculties ?? []))).sort(),
    [institutions]
  );

  const filtered = institutions.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (province && i.province !== province) return false;
    if (faculty && !(i.faculties ?? []).includes(faculty)) return false;
    if (maxAps && i.aps_requirement && i.aps_requirement > Number(maxAps)) return false;
    return true;
  });

  if (!studentId || loading) {
    return <p className="text-muted-foreground">Loading universities…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">University Applications</h1>
        <p className="text-muted-foreground">Browse and apply to universities across South Africa.</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={province} onChange={(e) => setProvince(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All provinces</option>
            {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={faculty} onChange={(e) => setFaculty(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All faculties</option>
            {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <Input type="number" placeholder="Max APS score" value={maxAps} onChange={(e) => setMaxAps(e.target.value)} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} universit{filtered.length === 1 ? "y" : "ies"} found</p>

      <div className="space-y-4">
        {filtered.map((inst) => (
          <Card key={inst.id}>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{inst.name}</h3>
                {inst.description && <p className="mt-1 text-sm text-muted-foreground">{inst.description}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {inst.province && (
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {inst.province}</span>
                  )}
                  {inst.closing_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Closes {new Date(inst.closing_date).toLocaleDateString()}
                    </span>
                  )}
                  {inst.aps_requirement && <span>Min. APS {inst.aps_requirement}</span>}
                </div>
                {inst.faculties && inst.faculties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {inst.faculties.map((f) => (
                      <span key={f} className="rounded-full bg-muted px-2 py-0.5 text-xs">{f}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0">
                <ApplyButton
                  studentId={studentId}
                  applicationType="university"
                  institutionId={inst.id}
                  existingStatus={applied[inst.id]?.status}
                  existingApplicationId={applied[inst.id]?.id}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No universities match your filters.</p>
        )}
      </div>
    </div>
  );
}
