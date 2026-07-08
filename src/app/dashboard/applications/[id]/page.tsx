"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_TYPES } from "@/lib/documents";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ApplicationStatus, ApplicationType, DocumentStatus } from "@/types/database.types";
import { CheckCircle2, Circle, XCircle, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_FLOW: ApplicationStatus[] = [
  "draft", "awaiting_documents", "awaiting_payment", "payment_verified",
  "submitted", "processing", "accepted", "completed",
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  awaiting_documents: "Awaiting Documents",
  awaiting_payment: "Awaiting Payment",
  payment_verified: "Payment Verified",
  submitted: "Submitted",
  processing: "Processing",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};

type Application = {
  id: string;
  application_type: ApplicationType;
  status: ApplicationStatus;
  assigned_consultant_id: string | null;
  timeline: { status: string; timestamp: string; note?: string }[];
  created_at: string;
  institutions: { name: string; type: string; province: string | null } | null;
  bursaries: { name: string } | null;
};

type DocSummary = { document_type: string; status: DocumentStatus };

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: app, error } = await supabase
        .from("applications")
        .select("id, application_type, status, assigned_consultant_id, timeline, created_at, institutions(name, type, province), bursaries(name)")
        .eq("id", params.id)
        .eq("student_id", user.id)
        .single();

      if (error || !app) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setApplication(app as unknown as Application);

      const { data: docs } = await supabase
        .from("documents")
        .select("document_type, status")
        .eq("student_id", user.id)
        .is("application_id", null);

      setDocuments((docs as DocSummary[]) ?? []);
      setLoading(false);
    }
    load();
  }, [supabase, params.id]);

  if (loading) return <p className="text-muted-foreground">Loading application…</p>;
  if (notFound || !application) return <p className="text-muted-foreground">Application not found.</p>;

  const targetName = application.institutions?.name ?? application.bursaries?.name ?? "Application";
  const isRejected = application.status === "rejected";
  const currentIndex = STATUS_FLOW.indexOf(application.status);
  const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);

  function docStatusFor(type: string) {
    return documents.find((d) => d.document_type === type)?.status ?? null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm capitalize text-muted-foreground">{application.application_type} application</p>
        <h1 className="text-2xl font-semibold">{targetName}</h1>
        {application.institutions?.province && (
          <p className="text-sm text-muted-foreground">{application.institutions.province}</p>
        )}
      </div>

      {application.assigned_consultant_id && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-2 pt-6 text-sm">
            <User className="h-4 w-4 text-primary" />
            A consultant has been assigned to help process your application.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application status</CardTitle>
          <CardDescription>
            {isRejected
              ? "This application was not successful. You can contact support if you have questions."
              : "Track your application's progress from start to finish."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRejected ? (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4" /> Application rejected
            </div>
          ) : (
            <ol className="space-y-1">
              {STATUS_FLOW.map((status, i) => {
                const done = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <li key={status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {done ? (
                        <CheckCircle2 className={cn("h-5 w-5", isCurrent ? "text-primary" : "text-secondary")} />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/40" />
                      )}
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={cn("h-8 w-px", done ? "bg-secondary" : "bg-border")} />
                      )}
                    </div>
                    <span className={cn("pt-0.5 text-sm", done ? "font-medium" : "text-muted-foreground")}>
                      {STATUS_LABELS[status]}
                      {isCurrent && <span className="ml-2 text-xs text-primary">(current)</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" /> Document checklist
          </CardTitle>
          <CardDescription>Required documents for this type of application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {requiredDocs.map(({ type, label }) => {
            const status = docStatusFor(type);
            return (
              <div key={type} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
                <span>{label}</span>
                {status === "approved" ? (
                  <span className="flex items-center gap-1 text-secondary"><CheckCircle2 className="h-4 w-4" /> Approved</span>
                ) : status === "rejected" ? (
                  <span className="flex items-center gap-1 text-destructive"><XCircle className="h-4 w-4" /> Rejected</span>
                ) : status === "pending" ? (
                  <span className="text-muted-foreground">Pending review</span>
                ) : (
                  <span className="text-accent">Not uploaded</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {application.timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            [...application.timeline].reverse().map((entry, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium">{STATUS_LABELS[entry.status as ApplicationStatus] ?? entry.status}</p>
                {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
                <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
