-- Cognita Storage buckets and object policies.
-- Public applicants must not upload sensitive files until the admissions process is approved.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'public-assets',
    'public-assets',
    true,
    15728640,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'applicant-documents',
    'applicant-documents',
    false,
    15728640,
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'learner-submissions',
    'learner-submissions',
    false,
    52428800,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  ),
  (
    'credential-files',
    'credential-files',
    false,
    15728640,
    array['application/pdf', 'image/png']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public brand and editorial assets.

create policy "public_assets_read"
on storage.objects for select to anon, authenticated
using (bucket_id = 'public-assets');

create policy "public_assets_admin_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'public-assets'
  and public.has_any_role(array['admin','founder']::public.app_role[])
);

create policy "public_assets_admin_update"
on storage.objects for update to authenticated
using (
  bucket_id = 'public-assets'
  and public.has_any_role(array['admin','founder']::public.app_role[])
)
with check (
  bucket_id = 'public-assets'
  and public.has_any_role(array['admin','founder']::public.app_role[])
);

create policy "public_assets_admin_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'public-assets'
  and public.has_any_role(array['admin','founder']::public.app_role[])
);

-- Applicant documents. Folder convention: <applicant-user-id>/<application-id>/<filename>
-- Unauthenticated applicant uploads must be handled by a protected Edge Function,
-- not by an anon storage policy.

create policy "applicant_documents_owner_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'applicant-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "applicant_documents_owner_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'applicant-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "applicant_documents_admissions_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'applicant-documents'
  and public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[])
);

create policy "applicant_documents_admissions_manage"
on storage.objects for update to authenticated
using (
  bucket_id = 'applicant-documents'
  and public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[])
)
with check (
  bucket_id = 'applicant-documents'
  and public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[])
);

-- Learner evidence. Folder convention: <student-id>/<submission-id>/<version>/<filename>

create policy "learner_submissions_owner_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'learner-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "learner_submissions_owner_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'learner-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.is_active_user()
);

create policy "learner_submissions_academic_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'learner-submissions'
  and public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[])
);

-- Direct object updates are intentionally not granted to students so submitted
-- versions remain immutable. New revisions use new versioned paths.

create policy "learner_submissions_admin_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'learner-submissions'
  and public.has_any_role(array['admin','founder']::public.app_role[])
);

-- Credentials. Folder convention: <student-id>/<credential-id>/<filename>

create policy "credential_files_owner_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'credential-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "credential_files_registrar_manage"
on storage.objects for all to authenticated
using (
  bucket_id = 'credential-files'
  and public.has_any_role(array['registrar','admin','founder']::public.app_role[])
)
with check (
  bucket_id = 'credential-files'
  and public.has_any_role(array['registrar','admin','founder']::public.app_role[])
);
