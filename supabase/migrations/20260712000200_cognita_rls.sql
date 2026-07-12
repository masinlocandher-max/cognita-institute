-- Cognita Institute Row Level Security and role policies
-- Service-role credentials bypass RLS and must never be exposed to the browser.

-- Automatically create a basic profile for new Auth users.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, status, metadata)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    case when new.email_confirmed_at is null then 'invited' else 'active' end,
    coalesce(new.raw_user_meta_data, '{}'::jsonb)
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, email_confirmed_at, raw_user_meta_data on auth.users
for each row execute function public.handle_new_auth_user();

-- Role helper functions.

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_roles sr
    where sr.user_id = auth.uid()
      and sr.role = required_role
      and sr.is_active = true
      and sr.revoked_at is null
  );
$$;

create or replace function public.has_any_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_roles sr
    where sr.user_id = auth.uid()
      and sr.role = any(required_roles)
      and sr.is_active = true
      and sr.revoked_at is null
  );
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  );
$$;

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.has_any_role(public.app_role[]) from public;
revoke all on function public.is_active_user() from public;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.has_any_role(public.app_role[]) to authenticated;
grant execute on function public.is_active_user() to authenticated;

-- Enable RLS on every business table.

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'staff_roles', 'programs', 'program_tracks', 'cohorts',
    'applications', 'application_status_history', 'interviews', 'admissions_notes',
    'consent_records', 'enrollments', 'access_entitlements', 'lessons',
    'lesson_progress', 'submissions', 'submission_versions', 'portfolio_audits',
    'credentials', 'support_tickets', 'payments', 'invoices', 'receipts',
    'refunds', 'email_outbox', 'audit_log'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('alter table public.%I force row level security', table_name);
  end loop;
end $$;

-- Profiles

create policy "profiles_select_own"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = auth.uid() and public.is_active_user())
with check (id = auth.uid());

create policy "profiles_staff_read"
on public.profiles for select to authenticated
using (public.has_any_role(array['facilitator','reviewer','admissions','registrar','support','finance','admin','founder']::public.app_role[]));

create policy "profiles_admin_manage"
on public.profiles for all to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admin','founder']::public.app_role[]));

-- Staff roles

create policy "staff_roles_self_read"
on public.staff_roles for select to authenticated
using (user_id = auth.uid());

create policy "staff_roles_admin_read"
on public.staff_roles for select to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]));

create policy "staff_roles_founder_manage"
on public.staff_roles for all to authenticated
using (public.has_role('founder'))
with check (public.has_role('founder'));

-- Public program catalogue

create policy "programs_public_read"
on public.programs for select to anon, authenticated
using (is_published = true);

create policy "programs_admin_manage"
on public.programs for all to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admin','founder']::public.app_role[]));

create policy "tracks_public_read"
on public.program_tracks for select to anon, authenticated
using (
  is_active = true
  and exists (
    select 1 from public.programs p
    where p.id = program_tracks.program_id and p.is_published = true
  )
);

create policy "tracks_admin_manage"
on public.program_tracks for all to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admin','founder']::public.app_role[]));

create policy "cohorts_public_open_read"
on public.cohorts for select to anon, authenticated
using (status = 'open');

create policy "cohorts_staff_read"
on public.cohorts for select to authenticated
using (public.has_any_role(array['facilitator','reviewer','admissions','registrar','support','finance','admin','founder']::public.app_role[]));

create policy "cohorts_admin_manage"
on public.cohorts for all to authenticated
using (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]));

-- Applications. Anonymous inserts must go through the submit-application Edge Function.

create policy "applications_applicant_read"
on public.applications for select to authenticated
using (applicant_user_id = auth.uid());

create policy "applications_admissions_read"
on public.applications for select to authenticated
using (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]));

create policy "applications_admissions_update"
on public.applications for update to authenticated
using (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]));

create policy "application_history_applicant_read"
on public.application_status_history for select to authenticated
using (
  exists (
    select 1 from public.applications a
    where a.id = application_status_history.application_id
      and a.applicant_user_id = auth.uid()
  )
);

create policy "application_history_staff_read"
on public.application_status_history for select to authenticated
using (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]));

create policy "interviews_applicant_read"
on public.interviews for select to authenticated
using (
  exists (
    select 1 from public.applications a
    where a.id = interviews.application_id
      and a.applicant_user_id = auth.uid()
  )
);

create policy "interviews_admissions_manage"
on public.interviews for all to authenticated
using (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]));

create policy "admissions_notes_staff_only"
on public.admissions_notes for all to authenticated
using (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['admissions','registrar','admin','founder']::public.app_role[]));

-- Consent

create policy "consent_own_read"
on public.consent_records for select to authenticated
using (user_id = auth.uid());

create policy "consent_privacy_staff_read"
on public.consent_records for select to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]));

-- Enrollment and entitlements

create policy "enrollments_student_read"
on public.enrollments for select to authenticated
using (student_id = auth.uid());

create policy "enrollments_staff_read"
on public.enrollments for select to authenticated
using (public.has_any_role(array['facilitator','reviewer','registrar','support','finance','admin','founder']::public.app_role[]));

create policy "enrollments_registrar_manage"
on public.enrollments for all to authenticated
using (public.has_any_role(array['registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['registrar','admin','founder']::public.app_role[]));

create policy "entitlements_student_read"
on public.access_entitlements for select to authenticated
using (student_id = auth.uid());

create policy "entitlements_registrar_manage"
on public.access_entitlements for all to authenticated
using (public.has_any_role(array['registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['registrar','admin','founder']::public.app_role[]));

create policy "entitlements_support_read"
on public.access_entitlements for select to authenticated
using (public.has_any_role(array['facilitator','support','finance']::public.app_role[]));

-- Lessons and learner progress

create policy "lessons_public_published_read"
on public.lessons for select to anon, authenticated
using (is_published = true);

create policy "lessons_academic_manage"
on public.lessons for all to authenticated
using (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]));

create policy "progress_student_manage"
on public.lesson_progress for all to authenticated
using (student_id = auth.uid() and public.is_active_user())
with check (student_id = auth.uid() and public.is_active_user());

create policy "progress_academic_read"
on public.lesson_progress for select to authenticated
using (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]));

-- Submissions and immutable versions

create policy "submissions_student_read"
on public.submissions for select to authenticated
using (student_id = auth.uid());

create policy "submissions_student_insert"
on public.submissions for insert to authenticated
with check (student_id = auth.uid() and public.is_active_user());

create policy "submissions_student_update_draft"
on public.submissions for update to authenticated
using (student_id = auth.uid() and status in ('draft','revision_required') and public.is_active_user())
with check (student_id = auth.uid());

create policy "submissions_academic_read"
on public.submissions for select to authenticated
using (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]));

create policy "submissions_reviewer_update"
on public.submissions for update to authenticated
using (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]));

create policy "submission_versions_student_read"
on public.submission_versions for select to authenticated
using (
  exists (
    select 1 from public.submissions s
    where s.id = submission_versions.submission_id
      and s.student_id = auth.uid()
  )
);

create policy "submission_versions_student_insert"
on public.submission_versions for insert to authenticated
with check (
  submitted_by = auth.uid()
  and exists (
    select 1 from public.submissions s
    where s.id = submission_versions.submission_id
      and s.student_id = auth.uid()
      and s.status in ('draft','revision_required')
  )
);

create policy "submission_versions_academic_read"
on public.submission_versions for select to authenticated
using (public.has_any_role(array['facilitator','reviewer','admin','founder']::public.app_role[]));

-- Portfolio audits

create policy "portfolio_student_read"
on public.portfolio_audits for select to authenticated
using (student_id = auth.uid());

create policy "portfolio_reviewers_read"
on public.portfolio_audits for select to authenticated
using (public.has_any_role(array['reviewer','registrar','admin','founder']::public.app_role[]));

create policy "portfolio_reviewers_manage"
on public.portfolio_audits for all to authenticated
using (public.has_any_role(array['reviewer','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['reviewer','admin','founder']::public.app_role[]));

-- Credentials are not directly public. Public verification uses the RPC below.

create policy "credentials_student_read"
on public.credentials for select to authenticated
using (student_id = auth.uid());

create policy "credentials_staff_read"
on public.credentials for select to authenticated
using (public.has_any_role(array['reviewer','registrar','admin','founder']::public.app_role[]));

create policy "credentials_registrar_manage"
on public.credentials for all to authenticated
using (public.has_any_role(array['registrar','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['registrar','admin','founder']::public.app_role[]));

create or replace function public.verify_credential(p_serial_number text)
returns table (
  serial_number text,
  credential_title text,
  holder_name text,
  status public.credential_status,
  issued_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz,
  public_metadata jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.serial_number,
    c.credential_title,
    p.full_name,
    c.status,
    c.issued_at,
    c.revoked_at,
    c.expires_at,
    c.public_metadata
  from public.credentials c
  join public.profiles p on p.id = c.student_id
  where c.serial_number = btrim(p_serial_number)
  limit 1;
$$;

revoke all on function public.verify_credential(text) from public;
grant execute on function public.verify_credential(text) to anon, authenticated;

-- Support

create policy "support_requester_read"
on public.support_tickets for select to authenticated
using (requester_id = auth.uid());

create policy "support_requester_insert"
on public.support_tickets for insert to authenticated
with check (requester_id = auth.uid());

create policy "support_staff_manage"
on public.support_tickets for all to authenticated
using (public.has_any_role(array['support','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['support','admin','founder']::public.app_role[]));

-- Finance

create policy "payments_student_read"
on public.payments for select to authenticated
using (student_id = auth.uid());

create policy "payments_finance_manage"
on public.payments for all to authenticated
using (public.has_any_role(array['finance','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['finance','admin','founder']::public.app_role[]));

create policy "invoices_student_read"
on public.invoices for select to authenticated
using (student_id = auth.uid());

create policy "invoices_finance_manage"
on public.invoices for all to authenticated
using (public.has_any_role(array['finance','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['finance','admin','founder']::public.app_role[]));

create policy "receipts_student_read"
on public.receipts for select to authenticated
using (
  exists (
    select 1 from public.payments p
    where p.id = receipts.payment_id and p.student_id = auth.uid()
  )
);

create policy "receipts_finance_manage"
on public.receipts for all to authenticated
using (public.has_any_role(array['finance','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['finance','admin','founder']::public.app_role[]));

create policy "refunds_student_read"
on public.refunds for select to authenticated
using (
  exists (
    select 1 from public.payments p
    where p.id = refunds.payment_id and p.student_id = auth.uid()
  )
);

create policy "refunds_finance_manage"
on public.refunds for all to authenticated
using (public.has_any_role(array['finance','admin','founder']::public.app_role[]))
with check (public.has_any_role(array['finance','admin','founder']::public.app_role[]));

-- Email queue and audit log

create policy "email_outbox_admin_read"
on public.email_outbox for select to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]));

create policy "audit_founder_read"
on public.audit_log for select to authenticated
using (public.has_any_role(array['admin','founder']::public.app_role[]));

-- Explicit grants. RLS still controls row visibility.

grant usage on schema public to anon, authenticated;
grant select on public.programs, public.program_tracks, public.cohorts, public.lessons to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.staff_roles to authenticated;
grant select, update on public.applications to authenticated;
grant select on public.application_status_history to authenticated;
grant select, insert, update, delete on public.interviews, public.admissions_notes to authenticated;
grant select on public.consent_records to authenticated;
grant select, insert, update, delete on public.enrollments, public.access_entitlements to authenticated;
grant select, insert, update on public.lesson_progress, public.submissions, public.submission_versions to authenticated;
grant select, insert, update, delete on public.portfolio_audits, public.credentials to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.payments, public.invoices, public.receipts, public.refunds to authenticated;
grant select on public.email_outbox, public.audit_log to authenticated;
grant usage, select on all sequences in schema public to authenticated;
