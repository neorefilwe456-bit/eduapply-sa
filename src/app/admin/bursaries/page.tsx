"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SA_PROVINCES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

type Bursary = {
  id: string;
  name: string;
  province: string | null;
  field_of_study: string | null;
  closing_date: string | null;
  nsfas_related: boolean;
};

const EMPTY_FORM = {
  name: "", province: "", career_field: "", faculty: "", closing_date: "",
  eligible_grade: "", nsfas_related: false, gender_requirement: "",
  disability_requirement: false, field_of_study: "", description: "",
};

export default function AdminBursariesPage() {
  const supabase = createClient();
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("bursaries").select("id, name, province, field_of_study, closing_date, nsfas_related").order("name");
    setBursaries((data as Bursary[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("bursaries").insert({
      name: form.name,
      province: form.province || null,
      career_field: form.career_field || null,
      faculty: form.faculty || null,
      closing_date: form.closing_date || null,
      eligible_grade: form.eligible_grade || null,
      nsfas_related: form.nsfas_related,
      gender_requirement: form.gender_requirement || null,
      disability_requirement: form.disability_requirement,
      field_of_study: form.field_of_study || null,
      description: form.description || null,
    });
    setSaving(false);
    setForm(EMPTY_FORM);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this bursary? This cannot be undone.")) return;
    await supabase.from("bursaries").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-muted-foreground">Loading bursaries…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bursaries</h1>
          <p className="text-muted-foreground">Manage scholarships, bursaries, and funding opportunities.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} className="gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New bursary</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Province (leave blank for national)</Label>
                <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">National</option>
                  {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Career field</Label>
                <Input value={form.career_field} onChange={(e) => setForm({ ...form, career_field: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Faculty</Label>
                <Input value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Field of study</Label>
                <Input value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Eligible grade</Label>
                <Input value={form.eligible_grade} onChange={(e) => setForm({ ...form, eligible_grade: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Closing date</Label>
                <Input type="date" value={form.closing_date} onChange={(e) => setForm({ ...form, closing_date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Gender requirement (optional)</Label>
                <Input value={form.gender_requirement} onChange={(e) => setForm({ ...form, gender_requirement: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.nsfas_related} onChange={(e) => setForm({ ...form, nsfas_related: e.target.checked })} className="h-4 w-4 rounded border-input" />
                <Label className="text-xs">NSFAS-related</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.disability_requirement} onChange={(e) => setForm({ ...form, disability_requirement: e.target.checked })} className="h-4 w-4 rounded border-input" />
                <Label className="text-xs">Disability requirement</Label>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Description</Label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create bursary"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {bursaries.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-sm text-muted-foreground">
                  {b.province ?? "National"} {b.nsfas_related && "· NSFAS"} {b.field_of_study && `· ${b.field_of_study}`}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
