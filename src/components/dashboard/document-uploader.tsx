"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MAX_FILE_SIZE_BYTES, ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS } from "@/lib/documents";
import type { DocumentType, DocumentStatus } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import {
  UploadCloud, FileText, Eye, RefreshCw, Trash2, Download, CheckCircle2, XCircle, Clock, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DocRow = {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  status: DocumentStatus;
  admin_notes: string | null;
  uploaded_at: string;
};

const STATUS_CONFIG: Record<DocumentStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending review", icon: Clock, className: "bg-muted text-muted-foreground" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-secondary/10 text-secondary" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/10 text-destructive" },
  expired: { label: "Expired", icon: AlertTriangle, className: "bg-accent/10 text-accent" },
};

export function DocumentUploader({
  studentId,
  documentType,
  label,
  required,
}: {
  studentId: string;
  documentType: DocumentType;
  label: string;
  required: boolean;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [doc, setDoc] = useState<DocRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoc = useCallback(async () => {
    const { data } = await supabase
      .from("documents")
      .select("id, file_path, file_name, file_size, status, admin_notes, uploaded_at")
      .eq("student_id", studentId)
      .eq("document_type", documentType)
      .is("application_id", null)
      .maybeSingle();
    setDoc(data as DocRow | null);
    setLoading(false);
  }, [supabase, studentId, documentType]);

  useEffect(() => {
    loadDoc();
  }, [loadDoc]);

  function validateFile(file: File): string | null {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are supported.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "File is too large — the maximum size is 20MB.";
    }
    return null;
  }

  async function handleFile(file: File) {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    const path = `${studentId}/${documentType}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Remove the old file from storage if replacing
    if (doc?.file_path) {
      await supabase.storage.from("documents").remove([doc.file_path]);
    }

    const payload = {
      student_id: studentId,
      document_type: documentType,
      file_path: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      status: "pending" as DocumentStatus,
      admin_notes: null,
      reviewed_at: null,
    };

    if (doc?.id) {
      await supabase.from("documents").update(payload).eq("id", doc.id);
    } else {
      await supabase.from("documents").insert(payload);
    }

    setUploading(false);
    loadDoc();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handlePreview() {
    if (!doc) return;
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function handleDownload() {
    if (!doc) return;
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_path, 60, { download: doc.file_name });
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function handleDelete() {
    if (!doc) return;
    await supabase.storage.from("documents").remove([doc.file_path]);
    await supabase.from("documents").delete().eq("id", doc.id);
    setDoc(null);
  }

  if (loading) {
    return <div className="h-24 animate-pulse rounded-lg border border-border bg-muted/40" />;
  }

  const status = doc ? STATUS_CONFIG[doc.status] : null;

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{label}</p>
          {required && <span className="text-xs text-destructive">*required</span>}
        </div>
        {status && (
          <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", status.className)}>
            <status.icon className="h-3 w-3" />
            {status.label}
          </span>
        )}
      </div>

      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      {doc?.admin_notes && doc.status === "rejected" && (
        <p className="mb-2 text-xs text-destructive">Admin note: {doc.admin_notes}</p>
      )}

      {!doc ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
          )}
        >
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {uploading ? "Uploading…" : "Drag & drop or click to upload — PDF, JPG, or PNG, up to 20MB"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm">{doc.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)}MB` : ""} · Uploaded{" "}
                {new Date(doc.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" onClick={handlePreview} aria-label="Preview">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => inputRef.current?.click()} aria-label="Replace">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
