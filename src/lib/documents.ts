import type { DocumentType } from "@/types/database.types";

export const DOCUMENT_TYPES: { type: DocumentType; label: string; required: boolean }[] = [
  { type: "certified_id", label: "Certified ID", required: true },
  { type: "passport", label: "Passport (if applicable)", required: false },
  { type: "matric_certificate", label: "Matric Certificate", required: true },
  { type: "grade_11_results", label: "Grade 11 Results", required: false },
  { type: "latest_results", label: "Latest Results", required: true },
  { type: "academic_transcript", label: "Academic Transcript", required: false },
  { type: "proof_of_residence", label: "Proof of Residence", required: true },
  { type: "proof_of_income", label: "Proof of Income", required: false },
  { type: "parent_id", label: "Parent/Guardian ID", required: false },
  { type: "parent_payslip", label: "Parent/Guardian Payslip", required: false },
  { type: "cv", label: "CV", required: false },
  { type: "motivation_letter", label: "Motivation Letter", required: false },
  { type: "qualification_certificate", label: "Qualification Certificate", required: false },
  { type: "marriage_certificate", label: "Marriage Certificate (optional)", required: false },
  { type: "name_change_document", label: "Name Change Document", required: false },
  { type: "proof_of_payment", label: "Proof of Payment", required: false },
  { type: "other", label: "Other Document", required: false },
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
export const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
export const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
