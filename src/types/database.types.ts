// This is a hand-written type file matching supabase/migrations/0001_schema.sql.
// Once your project is running, you can replace it with fully auto-generated types via:
//
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts

export type UserRole = "student" | "parent" | "admin" | "super_admin" | "consultant";
export type InstitutionType = "university" | "tvet_college" | "private_college" | "training_institute";
export type ApplicationType = "university" | "college" | "bursary";
export type ApplicationStatus =
  | "draft" | "awaiting_documents" | "awaiting_payment" | "payment_verified"
  | "submitted" | "processing" | "accepted" | "rejected" | "completed";
export type DocumentType =
  | "certified_id" | "passport" | "matric_certificate" | "grade_11_results"
  | "latest_results" | "academic_transcript" | "proof_of_residence" | "proof_of_income"
  | "parent_id" | "parent_payslip" | "cv" | "motivation_letter" | "qualification_certificate"
  | "marriage_certificate" | "name_change_document" | "proof_of_payment" | "other";
export type DocumentStatus = "pending" | "approved" | "rejected" | "expired";
export type PaymentStatus = "pending" | "verified" | "rejected";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type NotificationType = "website" | "email" | "sms_future" | "whatsapp_future";

type TableShape<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<{
        id: string;
        first_name: string;
        last_name: string;
        id_number: string | null;
        passport_number: string | null;
        date_of_birth: string | null;
        gender: string | null;
        mobile_number: string | null;
        email: string;
        province: string | null;
        city: string | null;
        physical_address: string | null;
        role: UserRole;
        profile_completion_percent: number;
        popia_consent: boolean;
        created_at: string;
        updated_at: string;
      }>;
      institutions: TableShape<{
        id: string;
        type: InstitutionType;
        name: string;
        province: string | null;
        faculties: string[] | null;
        qualifications_offered: string[] | null;
        aps_requirement: number | null;
        closing_date: string | null;
        logo_url: string | null;
        description: string | null;
        website_url: string | null;
        created_at: string;
        updated_at: string;
      }>;
      bursaries: TableShape<{
        id: string;
        name: string;
        province: string | null;
        career_field: string | null;
        faculty: string | null;
        closing_date: string | null;
        eligible_grade: string | null;
        nsfas_related: boolean;
        gender_requirement: string | null;
        disability_requirement: boolean;
        field_of_study: string | null;
        description: string | null;
        application_process: string | null;
        created_at: string;
        updated_at: string;
      }>;
      applications: TableShape<{
        id: string;
        student_id: string;
        institution_id: string | null;
        bursary_id: string | null;
        application_type: ApplicationType;
        status: ApplicationStatus;
        assigned_consultant_id: string | null;
        timeline: unknown;
        created_at: string;
        updated_at: string;
      }>;
      documents: TableShape<{
        id: string;
        student_id: string;
        application_id: string | null;
        document_type: DocumentType;
        file_path: string;
        file_name: string;
        file_size: number | null;
        mime_type: string | null;
        status: DocumentStatus;
        admin_notes: string | null;
        uploaded_at: string;
        reviewed_at: string | null;
      }>;
      payments: TableShape<{
        id: string;
        application_id: string;
        student_id: string;
        proof_of_payment_path: string | null;
        amount: number | null;
        status: PaymentStatus;
        verified_by: string | null;
        verified_at: string | null;
        created_at: string;
      }>;
      cv_profiles: TableShape<{
        id: string;
        student_id: string;
        personal_details: unknown;
        education: unknown;
        skills: unknown;
        languages: unknown;
        work_experience: unknown;
        references: unknown;
        achievements: unknown;
        volunteer_work: unknown;
        certificates: unknown;
        interests: unknown;
        professional_summary: string | null;
        selected_template: string | null;
        generated_pdf_path: string | null;
        updated_at: string;
      }>;
      notifications: TableShape<{
        id: string;
        user_id: string;
        type: NotificationType;
        title: string;
        message: string;
        read: boolean;
        created_at: string;
      }>;
      support_tickets: TableShape<{
        id: string;
        student_id: string;
        subject: string;
        message: string;
        status: TicketStatus;
        assigned_to: string | null;
        created_at: string;
        updated_at: string;
      }>;
      admin_notes: TableShape<{
        id: string;
        application_id: string;
        admin_id: string;
        note: string;
        created_at: string;
      }>;
      audit_logs: TableShape<{
        id: string;
        user_id: string | null;
        action: string;
        entity_type: string;
        entity_id: string | null;
        metadata: unknown;
        created_at: string;
      }>;
    };
  };
};
