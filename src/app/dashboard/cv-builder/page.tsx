"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EMPTY_CV, type CvProfileData, type CvTemplate } from "@/lib/cv-types";
import { CvRepeater } from "@/components/dashboard/cv/repeater";
import { CvPreview } from "@/components/dashboard/cv/cv-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CvBuilderPage() {
  const supabase = createClient();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [data, setData] = useState<CvProfileData>(EMPTY_CV);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setStudentId(user.id);

      const { data: cv } = await supabase.from("cv_profiles").select("*").eq("student_id", user.id).maybeSingle();
      if (cv) {
        setData({
          personal_details: (cv.personal_details as CvProfileData["personal_details"]) ?? EMPTY_CV.personal_details,
          professional_summary: cv.professional_summary ?? "",
          education: (cv.education as CvProfileData["education"]) ?? [],
          work_experience: (cv.work_experience as CvProfileData["work_experience"]) ?? [],
          skills: (cv.skills as string[]) ?? [],
          languages: (cv.languages as string[]) ?? [],
          references: (cv.references as CvProfileData["references"]) ?? [],
          achievements: (cv.achievements as string[]) ?? [],
          volunteer_work: (cv.volunteer_work as CvProfileData["volunteer_work"]) ?? [],
          certificates: (cv.certificates as string[]) ?? [],
          interests: (cv.interests as string[]) ?? [],
          selected_template: (cv.selected_template as CvTemplate) ?? "classic",
        });
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  function update<K extends keyof CvProfileData>(key: K, value: CvProfileData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    if (!studentId) return;
    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from("cv_profiles").upsert(
      { student_id: studentId, ...data, updated_at: new Date().toISOString() },
      { onConflict: "student_id" }
    );

    setSaving(false);
    setMessage(error ? error.message : "CV saved successfully.");
  }

  function handleDownload() {
    setTab("preview");
    setTimeout(() => window.print(), 150);
  }

  if (loading || !studentId) {
    return <p className="text-muted-foreground">Loading your CV…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">CV Builder</h1>
          <p className="text-muted-foreground">Build a professional CV you can reuse across every application.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.includes("success") ? "success" : "destructive"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-1 border-b border-border print:hidden">
        {(["edit", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "edit" ? (
        <div className="space-y-6 print:hidden">
          <Card>
            <CardHeader><CardTitle className="text-base">Template</CardTitle></CardHeader>
            <CardContent className="flex gap-3">
              {(["classic", "modern"] as CvTemplate[]).map((t) => (
                <button
                  key={t}
                  onClick={() => update("selected_template", t)}
                  className={cn(
                    "rounded-md border px-4 py-2 text-sm capitalize",
                    data.selected_template === t ? "border-primary bg-primary/10 text-primary" : "border-border"
                  )}
                >
                  {t}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Personal Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Full name</Label>
                <Input value={data.personal_details.full_name}
                  onChange={(e) => update("personal_details", { ...data.personal_details, full_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={data.personal_details.phone}
                  onChange={(e) => update("personal_details", { ...data.personal_details, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input value={data.personal_details.email}
                  onChange={(e) => update("personal_details", { ...data.personal_details, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Address</Label>
                <Input value={data.personal_details.address}
                  onChange={(e) => update("personal_details", { ...data.personal_details, address: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">LinkedIn / portfolio (optional)</Label>
                <Input value={data.personal_details.linkedin}
                  onChange={(e) => update("personal_details", { ...data.personal_details, linkedin: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Professional Summary</CardTitle></CardHeader>
            <CardContent>
              <textarea
                rows={4}
                value={data.professional_summary}
                onChange={(e) => update("professional_summary", e.target.value)}
                placeholder="A short paragraph introducing who you are and what you're aiming for."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Education</CardTitle></CardHeader>
            <CardContent>
              <CvRepeater
                items={data.education}
                onChange={(items) => update("education", items)}
                fields={[
                  { key: "qualification", label: "Qualification" },
                  { key: "institution", label: "Institution / School" },
                  { key: "start_year", label: "Start year" },
                  { key: "end_year", label: "End year" },
                  { key: "description", label: "Description (optional)", type: "textarea" },
                ]}
                emptyItem={{ qualification: "", institution: "", start_year: "", end_year: "", description: "" }}
                addLabel="Add education"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Work Experience</CardTitle></CardHeader>
            <CardContent>
              <CvRepeater
                items={data.work_experience}
                onChange={(items) => update("work_experience", items)}
                fields={[
                  { key: "role", label: "Role / Title" },
                  { key: "employer", label: "Employer" },
                  { key: "start_date", label: "Start date" },
                  { key: "end_date", label: "End date (or Present)" },
                  { key: "description", label: "Description (optional)", type: "textarea" },
                ]}
                emptyItem={{ role: "", employer: "", start_date: "", end_date: "", description: "" }}
                addLabel="Add work experience"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Volunteer Work</CardTitle></CardHeader>
            <CardContent>
              <CvRepeater
                items={data.volunteer_work}
                onChange={(items) => update("volunteer_work", items)}
                fields={[
                  { key: "role", label: "Role" },
                  { key: "organisation", label: "Organisation" },
                  { key: "description", label: "Description (optional)", type: "textarea" },
                ]}
                emptyItem={{ role: "", organisation: "", description: "" }}
                addLabel="Add volunteer experience"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">References</CardTitle></CardHeader>
            <CardContent>
              <CvRepeater
                items={data.references}
                onChange={(items) => update("references", items)}
                fields={[
                  { key: "name", label: "Name" },
                  { key: "relationship", label: "Relationship" },
                  { key: "contact", label: "Contact details" },
                ]}
                emptyItem={{ name: "", relationship: "", contact: "" }}
                addLabel="Add reference"
              />
            </CardContent>
          </Card>

          {([
            { key: "skills", label: "Skills", placeholder: "e.g. Microsoft Excel, Public Speaking, Time Management" },
            { key: "languages", label: "Languages", placeholder: "e.g. English (Home), isiZulu (First additional)" },
            { key: "achievements", label: "Achievements", placeholder: "e.g. Head Prefect 2025, Provincial Chess Champion" },
            { key: "certificates", label: "Certificates", placeholder: "e.g. First Aid Level 1, Google Digital Skills" },
            { key: "interests", label: "Interests", placeholder: "e.g. Reading, Soccer, Debate" },
          ] as const).map(({ key, label, placeholder }) => (
            <Card key={key}>
              <CardHeader><CardTitle className="text-base">{label}</CardTitle></CardHeader>
              <CardContent>
                <textarea
                  rows={2}
                  value={(data[key] as string[]).join(", ")}
                  onChange={(e) => update(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as any)}
                  placeholder={`Separate with commas — ${placeholder}`}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <CvPreview data={data} />
      )}
    </div>
  );
}
