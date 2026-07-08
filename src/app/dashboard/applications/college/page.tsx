"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SA_PROVINCES } from "@/lib/constants";
import { ApplyButton } from "@/components/dashboard/apply-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ApplicationStatus, InstitutionType } from "@/types/database.types";
import { Search, MapPin, Calendar } from "lucide-react";

type Institution = {
  id: string;
  type: InstitutionType;
  name: string;
  province: string | null;
  qualifications_offered: string[] | null;
  closing_date: string | null;
  description: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  tvet_college: "TVET College",
  private_college: "Private College",
  training_institute: "Training Institute",
};

type AppliedInfo = { status: ApplicationStatus; id: string };

export default function CollegeApplicationsPage() {
  const supabase = createClient();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [applied, setApplied] = useState<Record<string, AppliedInfo>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [collegeType, setCollegeType] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setStudentId(user.id);

      const [{ data: insts }, { data: apps }] = await Promise.all([
        supabase.from("institutions").select("*").in("type", ["tvet_college", "private_college", "training_institute"]).order("closing_date"),
        supabase.from("applications").select("id, institution_id, status").eq("student_id", user.id).eq("application_type", "college"),
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

  const filtered = institutions.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (province && i.province !== province) return false;
    if (collegeType && i.type !== collegeType) return false;
    return true;
  });

  if (!studentId || loading) {
    return <p className="text-muted-foreground">Loading colleges…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">College Applications</h1>
        <p className="text-muted-foreground">Browse TVET colleges, private colleges, and training institutes.</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={province} onChange={(e) => setProvince(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All provinces</option>
            {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={collegeType} onChange={(e) => setCollegeType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All institution types</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} institution{filtered.length === 1 ? "" : "s"} found</p>

      <div className="space-y-4">
        {filtered.map((inst) => (
          <Card key={inst.id}>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{inst.name}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{TYPE_LABELS[inst.type]}</span>
                </div>
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
                </div>
                {inst.qualifications_offered && inst.qualifications_offered.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {inst.qualifications_offered.map((q) => (
                      <span key={q} className="rounded-full bg-muted px-2 py-0.5 text-xs">{q}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0">
                <ApplyButton
                  studentId={studentId}
                  applicationType="college"
                  institutionId={inst.id}
                  existingStatus={applied[inst.id]?.status}
                  existingApplicationId={applied[inst.id]?.id}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No institutions match your filters.</p>
        )}
      </div>
    </div>
  );
}
