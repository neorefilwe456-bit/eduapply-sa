import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { ApplicationType, ApplicationStatus } from "@/types/database.types";
import { CheckCircle2, Loader2 } from "lucide-react";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft started",
  awaiting_documents: "Awaiting documents",
  awaiting_payment: "Awaiting payment",
  payment_verified: "Payment verified",
  submitted: "Submitted",
  processing: "Processing",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};

export function ApplyButton({
  studentId,
  applicationType,
  institutionId,
  bursaryId,
  existingStatus,
  existingApplicationId,
  onApplied,
}: {
  studentId: string;
  applicationType: ApplicationType;
  institutionId?: string;
  bursaryId?: string;
  existingStatus?: ApplicationStatus | null;
  existingApplicationId?: string | null;
  onApplied?: (applicationId: string) => void;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus | null | undefined>(existingStatus);
  const [applicationId, setApplicationId] = useState<string | null | undefined>(existingApplicationId);

  async function handleApply() {
    setLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        student_id: studentId,
        institution_id: institutionId ?? null,
        bursary_id: bursaryId ?? null,
        application_type: applicationType,
        status: "draft",
        timeline: [
          { status: "draft", timestamp: new Date().toISOString(), note: "Application started by student" },
        ],
      })
      .select("id")
      .single();

    setLoading(false);

    if (!error && data) {
      setStatus("draft");
      setApplicationId(data.id);
      onApplied?.(data.id);
    }
  }

  if (status) {
    const badge = (
      <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-secondary/20">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {STATUS_LABELS[status]}
      </span>
    );
    return applicationId ? (
      <Link href={`/dashboard/applications/${applicationId}`}>{badge}</Link>
    ) : (
      badge
    );
  }

  return (
    <Button size="sm" onClick={handleApply} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
    </Button>
  );
}
