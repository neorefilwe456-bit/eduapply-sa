"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SA_PROVINCES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InstitutionType } from "@/types/database.types";
import { Trash2, Plus } from "lucide-react";

type Institution = {
  id: string;
  type: InstitutionType;
  name: string;
  province: string | null;
  faculties: string[] | null;
  qualifications_offered: string[] | null;
  aps_requirement: number | null;
  closing_date: string | null;
  description: string | null;
};

const EMPTY_FORM = {
  type: "university" as InstitutionType,
  name: "", province: "", faculties: "", qualifications_offered: "",
  aps_requirement: "", closing_date: "", description: "", website_url: "",
};

export default function AdminInstitutionsPage() {
  const supabase = createClient();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("institutions").select("*").order("name");
    setInstitutions((data as Institution[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("institutions").insert({
      type: form.type,
      name: form.name,
      province: form.province || null,
      faculties: form.faculties ? form.faculties.split(",").map((s) => s.trim()) : null,
      qualifications_offered: form.qualifications_offered ? form.qualifications_offered.split(",").map((s) => s.trim()) : null,
      aps_requirement: form.aps_requirement ? Number(form.aps_requirement) : null,
      closing_date: form.closing_date || null,
      description: form.description || null,
      website_url: form.website_url || null,
    });
    setSaving(false);
    setForm(EMPTY_FORM);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this institution? This cannot be undone.")) return;
    await supabase.from("institutions").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-muted-foreground">Loading institutions…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Institutions & Colleges</h1>
          <p className="text-muted-foreground">Manage universities, TVET colleges, private colleges, and training institutes.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} className="gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New institution</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as InstitutionType })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="university">University</option>
                  <option value="tvet_college">TVET College</option>
                  <option value="private_college">Private College</option>
                  <option value="training_institute">Training Institute</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Province</Label>
                <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select…</option>
                  {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Closing date</Label>
                <Input type="date" value={form.closing_date} onChange={(e) => setForm({ ...form, closing_date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Faculties (comma separated)</Label>
                <Input value={form.faculties} onChange={(e) => setForm({ ...form, faculties: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Qualifications offered (comma separated)</Label>
                <Input value={form.qualifications_offered} onChange={(e) => setForm({ ...form, qualifications_offered: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Min. APS score (universities only)</Label>
                <Input type="number" value={form.aps_requirement} onChange={(e) => setForm({ ...form, aps_requirement: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Website URL</Label>
                <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Description</Label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create institution"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {institutions.map((inst) => (
          <Card key={inst.id}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="font-medium">{inst.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {inst.type.replace("_", " ")} · {inst.province ?? "No province set"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(inst.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
