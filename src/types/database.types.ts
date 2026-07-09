export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_notes: {
        Row: {
          admin_id: string
          application_id: string
          created_at: string
          id: string
          note: string
        }
        Insert: {
          admin_id: string
          application_id: string
          created_at?: string
          id?: string
          note: string
        }
        Update: {
          admin_id?: string
          application_id?: string
          created_at?: string
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_notes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_type: Database["public"]["Enums"]["application_type"]
          assigned_consultant_id: string | null
          bursary_id: string | null
          created_at: string
          id: string
          institution_id: string | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          timeline: Json
          updated_at: string
        }
        Insert: {
          application_type: Database["public"]["Enums"]["application_type"]
          assigned_consultant_id?: string | null
          bursary_id?: string | null
          created_at?: string
          id?: string
          institution_id?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          timeline?: Json
          updated_at?: string
        }
        Update: {
          application_type?: Database["public"]["Enums"]["application_type"]
          assigned_consultant_id?: string | null
          bursary_id?: string | null
          created_at?: string
          id?: string
          institution_id?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          timeline?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_assigned_consultant_id_fkey"
            columns: ["assigned_consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_bursary_id_fkey"
            columns: ["bursary_id"]
            isOneToOne: false
            referencedRelation: "bursaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bursaries: {
        Row: {
          application_process: string | null
          career_field: string | null
          closing_date: string | null
          created_at: string
          description: string | null
          disability_requirement: boolean
          eligible_grade: string | null
          faculty: string | null
          field_of_study: string | null
          gender_requirement: string | null
          id: string
          name: string
          nsfas_related: boolean
          province: string | null
          updated_at: string
        }
        Insert: {
          application_process?: string | null
          career_field?: string | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          disability_requirement?: boolean
          eligible_grade?: string | null
          faculty?: string | null
          field_of_study?: string | null
          gender_requirement?: string | null
          id?: string
          name: string
          nsfas_related?: boolean
          province?: string | null
          updated_at?: string
        }
        Update: {
          application_process?: string | null
          career_field?: string | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          disability_requirement?: boolean
          eligible_grade?: string | null
          faculty?: string | null
          field_of_study?: string | null
          gender_requirement?: string | null
          id?: string
          name?: string
          nsfas_related?: boolean
          province?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cv_profiles: {
        Row: {
          achievements: Json
          certificates: Json
          education: Json
          generated_pdf_path: string | null
          id: string
          interests: Json
          languages: Json
          personal_details: Json
          professional_summary: string | null
          references: Json
          selected_template: string | null
          skills: Json
          student_id: string
          updated_at: string
          volunteer_work: Json
          work_experience: Json
        }
        Insert: {
          achievements?: Json
          certificates?: Json
          education?: Json
          generated_pdf_path?: string | null
          id?: string
          interests?: Json
          languages?: Json
          personal_details?: Json
          professional_summary?: string | null
          references?: Json
          selected_template?: string | null
          skills?: Json
          student_id: string
          updated_at?: string
          volunteer_work?: Json
          work_experience?: Json
        }
        Update: {
          achievements?: Json
          certificates?: Json
          education?: Json
          generated_pdf_path?: string | null
          id?: string
          interests?: Json
          languages?: Json
          personal_details?: Json
          professional_summary?: string | null
          references?: Json
          selected_template?: string | null
          skills?: Json
          student_id?: string
          updated_at?: string
          volunteer_work?: Json
          work_experience?: Json
        }
        Relationships: [
          {
            foreignKeyName: "cv_profiles_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          admin_notes: string | null
          application_id: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["document_status"]
          student_id: string
          uploaded_at: string
        }
        Insert: {
          admin_notes?: string | null
          application_id?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          student_id: string
          uploaded_at?: string
        }
        Update: {
          admin_notes?: string | null
          application_id?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          student_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          aps_requirement: number | null
          closing_date: string | null
          created_at: string
          description: string | null
          faculties: string[] | null
          id: string
          logo_url: string | null
          name: string
          province: string | null
          qualifications_offered: string[] | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          aps_requirement?: number | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          faculties?: string[] | null
          id?: string
          logo_url?: string | null
          name: string
          province?: string | null
          qualifications_offered?: string[] | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          aps_requirement?: number | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          faculties?: string[] | null
          id?: string
          logo_url?: string | null
          name?: string
          province?: string | null
          qualifications_offered?: string[] | null
          type?: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          application_id: string
          created_at: string
          id: string
          proof_of_payment_path: string | null
          status: Database["public"]["Enums"]["payment_status"]
          student_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount?: number | null
          application_id: string
          created_at?: string
          id?: string
          proof_of_payment_path?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number | null
          application_id?: string
          created_at?: string
          id?: string
          proof_of_payment_path?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          gender: string | null
          id: string
          id_number: string | null
          last_name: string
          mobile_number: string | null
          passport_number: string | null
          physical_address: string | null
          popia_consent: boolean
          profile_completion_percent: number
          province: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          gender?: string | null
          id: string
          id_number?: string | null
          last_name: string
          mobile_number?: string | null
          passport_number?: string | null
          physical_address?: string | null
          popia_consent?: boolean
          profile_completion_percent?: number
          province?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          id_number?: string | null
          last_name?: string
          mobile_number?: string | null
          passport_number?: string | null
          physical_address?: string | null
          popia_consent?: boolean
          profile_completion_percent?: number
          province?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          message: string
          status: Database["public"]["Enums"]["ticket_status"]
          student_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message: string
          status?: Database["public"]["Enums"]["ticket_status"]
          student_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          student_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      application_status:
        | "draft"
        | "awaiting_documents"
        | "awaiting_payment"
        | "payment_verified"
        | "submitted"
        | "processing"
        | "accepted"
        | "rejected"
        | "completed"
      application_type: "university" | "college" | "bursary"
      document_status: "pending" | "approved" | "rejected" | "expired"
      document_type:
        | "certified_id"
        | "passport"
        | "matric_certificate"
        | "grade_11_results"
        | "latest_results"
        | "academic_transcript"
        | "proof_of_residence"
        | "proof_of_income"
        | "parent_id"
        | "parent_payslip"
        | "cv"
        | "motivation_letter"
        | "qualification_certificate"
        | "marriage_certificate"
        | "name_change_document"
        | "proof_of_payment"
        | "other"
      institution_type:
        | "university"
        | "tvet_college"
        | "private_college"
        | "training_institute"
      notification_type: "website" | "email" | "sms_future" | "whatsapp_future"
      payment_status: "pending" | "verified" | "rejected"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "student" | "parent" | "admin" | "super_admin" | "consultant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "draft",
        "awaiting_documents",
        "awaiting_payment",
        "payment_verified",
        "submitted",
        "processing",
        "accepted",
        "rejected",
        "completed",
      ],
      application_type: ["university", "college", "bursary"],
      document_status: ["pending", "approved", "rejected", "expired"],
      document_type: [
        "certified_id",
        "passport",
        "matric_certificate",
        "grade_11_results",
        "latest_results",
        "academic_transcript",
        "proof_of_residence",
        "proof_of_income",
        "parent_id",
        "parent_payslip",
        "cv",
        "motivation_letter",
        "qualification_certificate",
        "marriage_certificate",
        "name_change_document",
        "proof_of_payment",
        "other",
      ],
      institution_type: [
        "university",
        "tvet_college",
        "private_college",
        "training_institute",
      ],
      notification_type: ["website", "email", "sms_future", "whatsapp_future"],
      payment_status: ["pending", "verified", "rejected"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["student", "parent", "admin", "super_admin", "consultant"],
    },
  },
} as const


// Convenience type aliases used throughout the app
export type ApplicationStatus = Database["public"]["Enums"]["application_status"]
export type ApplicationType = Database["public"]["Enums"]["application_type"]
export type DocumentStatus = Database["public"]["Enums"]["document_status"]
export type DocumentType = Database["public"]["Enums"]["document_type"]
export type InstitutionType = Database["public"]["Enums"]["institution_type"]
export type NotificationType = Database["public"]["Enums"]["notification_type"]
export type PaymentStatus = Database["public"]["Enums"]["payment_status"]
export type TicketStatus = Database["public"]["Enums"]["ticket_status"]
export type UserRole = Database["public"]["Enums"]["user_role"]