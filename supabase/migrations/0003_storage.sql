-- =========================================================
-- EduApply SA — Document Storage (Phase 2, Step 2)
-- Run this AFTER 0001_schema.sql and 0002_rls_policies.sql
-- =========================================================

-- Create a private bucket for student documents.
-- Files are stored under a path like: {student_id}/{document_type}/{filename}
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  20971520, -- 20MB in bytes
  array['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
on conflict (id) do nothing;

-- ---------- storage policies ----------
-- Students can upload into their own folder (first path segment = their user id)
create policy "Students upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Students view own files"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or is_staff(auth.uid())
    )
  );

create policy "Students update own files"
  on storage.objects for update
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Students delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
