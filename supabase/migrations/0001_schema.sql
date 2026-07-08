-- =========================================================
-- EduApply SA — Core Schema (Phase 1)
-- Run this in Supabase SQL Editor: Project > SQL Editor > New Query
-- =========================================================

-- ---------- Enums ----------
create type user_role as enum ('student', 'parent', 'admin', 'super_admin', 'consultant');
create type institution_type as enum ('university', 'tvet_college', 'private_college', 'training_institute');
create type application_type as enum ('university', 'college', 'bursary');
create type application_status as enum (
  'draft', 'awaiting_documents', 'awaiting_payment', 'payment_verified',
  'submitted', 'processing', 'accepted', 'rejected', 'completed'
);
create type document_type as enum (
  'certified_id', 'passport', 'matric_certificate', 'grade_11_results',
  'latest_results', 'academic_transcript', 'proof_of_residence', 'proof_of_income',
  'parent_id', 'parent_payslip', 'cv', 'motivation_letter', 'qualification_certificate',
  'marriage_certificate', 'name_change_document', 'proof_of_payment', 'other'
);
create type document_status as enum ('pending', 'approved', 'rejected', 'expired');
create type payment_status as enum ('pending', 'verified', 'rejected');
create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
create type notification_type as enum ('website', 'email', 'sms_future', 'whatsapp_future');

-- ---------- profiles (extends auth.users) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  id_number text,
  passport_number text,
  date_of_birth date,
  gender text,
  mobile_number text,
  email text not null,
  province text,
  city text,
  physical_address text,
  role user_role not null default 'student',
  profile_completion_percent int not null default 0,
  popia_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- institutions ----------
create table institutions (
  id uuid primary key default gen_random_uuid(),
  type institution_type not null,
  name text not null,
  province text,
  faculties text[],
  qualifications_offered text[],
  aps_requirement int,
  closing_date date,
  logo_url text,
  description text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- bursaries ----------
create table bursaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text,
  career_field text,
  faculty text,
  closing_date date,
  eligible_grade text,
  nsfas_related boolean not null default false,
  gender_requirement text,
  disability_requirement boolean not null default false,
  field_of_study text,
  description text,
  application_process text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- applications ----------
create table applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  institution_id uuid references institutions(id),
  bursary_id uuid references bursaries(id),
  application_type application_type not null,
  status application_status not null default 'draft',
  assigned_consultant_id uuid references profiles(id),
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_target_only check (
    (institution_id is not null and bursary_id is null) or
    (institution_id is null and bursary_id is not null)
  )
);

-- ---------- documents ----------
create table documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  application_id uuid references applications(id) on delete set null,
  document_type document_type not null,
  file_path text not null,
  file_name text not null,
  file_size int,
  mime_type text,
  status document_status not null default 'pending',
  admin_notes text,
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ---------- payments ----------
create table payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  proof_of_payment_path text,
  amount numeric(10,2),
  status payment_status not null default 'pending',
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- cv_profiles ----------
create table cv_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references profiles(id) on delete cascade,
  personal_details jsonb not null default '{}'::jsonb,
  education jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  work_experience jsonb not null default '[]'::jsonb,
  "references" jsonb not null default '[]'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  volunteer_work jsonb not null default '[]'::jsonb,
  certificates jsonb not null default '[]'::jsonb,
  interests jsonb not null default '[]'::jsonb,
  professional_summary text,
  selected_template text default 'classic',
  generated_pdf_path text,
  updated_at timestamptz not null default now()
);

-- ---------- notifications ----------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null default 'website',
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- support_tickets ----------
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status ticket_status not null default 'open',
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- admin_notes ----------
create table admin_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  admin_id uuid not null references profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

-- ---------- audit_logs ----------
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------- indexes ----------
create index idx_applications_student on applications(student_id);
create index idx_applications_status on applications(status);
create index idx_documents_student on documents(student_id);
create index idx_documents_application on documents(application_id);
create index idx_institutions_closing_date on institutions(closing_date);
create index idx_bursaries_closing_date on bursaries(closing_date);
create index idx_notifications_user on notifications(user_id);
create index idx_support_tickets_student on support_tickets(student_id);

-- ---------- auto-create profile on signup ----------
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- updated_at helper ----------
create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on profiles
  for each row execute procedure public.set_updated_at();
create trigger set_applications_updated_at before update on applications
  for each row execute procedure public.set_updated_at();
create trigger set_support_tickets_updated_at before update on support_tickets
  for each row execute procedure public.set_updated_at();
