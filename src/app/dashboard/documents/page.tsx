"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_TYPES } from "@/lib/documents";
import { DocumentUploader } from "@/components/dashboard/document-uploader";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentsPage() {
  const supabase = createClient();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setStudentId(user.id);

      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)
        .is("application_id", null);
      setUploadedCount(count ?? 0);
    }
    load();
  }, [supabase]);

  const requiredCount = DOCUMENT_TYPES.filter((d) => d.required).length;

  if (!studentId) {
    return <p className="text-muted-foreground">Loading your documents…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Documents</h1>
        <p className="text-muted-foreground">
          Upload each document once — you'll be able to reuse them across every
          application without uploading again.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="font-medium">{uploadedCount} document{uploadedCount === 1 ? "" : "s"} uploaded</p>
            <p className="text-sm text-muted-foreground">{requiredCount} documents are marked as required</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {DOCUMENT_TYPES.map(({ type, label, required }) => (
          <DocumentUploader
            key={type}
            studentId={studentId}
            documentType={type}
            label={label}
            required={required}
          />
        ))}
      </div>
    </div>
  );
}
