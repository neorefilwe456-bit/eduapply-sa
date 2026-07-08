-- =========================================================
-- EduApply SA — Row Level Security Policies (Phase 1)
-- Run this AFTER 0001_schema.sql
-- =========================================================

-- ---------- enable RLS everywhere ----------
alter table profiles enable row level security;
alter table institutions enable row level security;
alter table bursaries enable row level security;
alter table applications enable row level security;
alter table documents enable row level security;
alter table payments enable row level security;
alter table cv_profiles enable row level security;
alter table notifications enable row level security;
alter table support_tickets enable row level security;
alter table admin_notes enable row level security;
alter table audit_logs enable row level security;

-- ---------- helper: is the current user staff? ----------
create function public.is_staff(uid uuid)
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = uid and role in ('admin', 'super_admin', 'consultant')
  );
$$ language sql security definer stable;

-- ---------- profiles ----------
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id or is_staff(auth.uid()));

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id or is_staff(auth.uid()));

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ---------- institutions (public read, staff write) ----------
create policy "Anyone can view institutions"
  on institutions for select using (true);

create policy "Staff can manage institutions"
  on institutions for all
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- ---------- bursaries (public read, staff write) ----------
create policy "Anyone can view bursaries"
  on bursaries for select using (true);

create policy "Staff can manage bursaries"
  on bursaries for all
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- ---------- applications ----------
create policy "Students view own applications"
  on applications for select
  using (auth.uid() = student_id or is_staff(auth.uid()));

create policy "Students create own applications"
  on applications for insert
  with check (auth.uid() = student_id);

create policy "Students update own draft applications"
  on applications for update
  using (auth.uid() = student_id and status = 'draft')
  with check (auth.uid() = student_id);

create policy "Staff manage all applications"
  on applications for update
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- ---------- documents ----------
create policy "Students view own documents"
  on documents for select
  using (auth.uid() = student_id or is_staff(auth.uid()));

create policy "Students upload own documents"
  on documents for insert
  with check (auth.uid() = student_id);

create policy "Students update own pending documents"
  on documents for update
  using (auth.uid() = student_id and status = 'pending');

create policy "Students delete own pending documents"
  on documents for delete
  using (auth.uid() = student_id and status = 'pending');

create policy "Staff manage all documents"
  on documents for update
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- ---------- payments ----------
create policy "Students view own payments"
  on payments for select
  using (auth.uid() = student_id or is_staff(auth.uid()));

create policy "Students create own payments"
  on payments for insert
  with check (auth.uid() = student_id);

create policy "Staff verify payments"
  on payments for update
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- ---------- cv_profiles ----------
create policy "Students manage own cv"
  on cv_profiles for all
  using (auth.uid() = student_id or is_staff(auth.uid()))
  with check (auth.uid() = student_id);

-- ---------- notifications ----------
create policy "Users view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

create policy "Staff create notifications"
  on notifications for insert
  with check (is_staff(auth.uid()) or auth.uid() = user_id);

-- ---------- support_tickets ----------
create policy "Students manage own tickets"
  on support_tickets for select
  using (auth.uid() = student_id or is_staff(auth.uid()));

create policy "Students create own tickets"
  on support_tickets for insert
  with check (auth.uid() = student_id);

create policy "Staff update tickets"
  on support_tickets for update
  using (is_staff(auth.uid()));

-- ---------- admin_notes (staff only, never students) ----------
create policy "Staff view admin notes"
  on admin_notes for select
  using (is_staff(auth.uid()));

create policy "Staff create admin notes"
  on admin_notes for insert
  with check (is_staff(auth.uid()));

-- ---------- audit_logs (staff read-only, system writes) ----------
create policy "Staff view audit logs"
  on audit_logs for select
  using (is_staff(auth.uid()));

create policy "Authenticated users write audit logs"
  on audit_logs for insert
  with check (auth.uid() is not null);
