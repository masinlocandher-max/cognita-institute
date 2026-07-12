-- Cognita Institute core Supabase schema
-- Preparation only. Review in a disposable environment before remote deployment.

create extension if not exists pgcrypto with schema extensions;

-- Enumerations

do $$ begin
  create type public.app_role as enum (
    'applicant',
    'student',
    'facilitator',
    'reviewer',
    'admissions',
    'registrar',
    'support',
    'finance',
    'admin',
    'founder'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.application_status as enum (
    'new',
    'under_review',
    'for_interview',
    'accepted',
    'waitlisted',
    'declined',
    'withdrawn',
    'enrolled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.enrollment_status as enum (
    'pending',
    'active',
    'suspended',
    'completed',
    'withdrawn',
    'cancelled',
    'expired'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.submission_status as enum (
    'draft',
    'submitted',
    'under_review',
    'revision_required',
    'passed',
    'failed',
    'withdrawn'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.audit_decision as enum (
    'pending',
    'revision_required',
    'cognita_standard_met',
    'not_approved'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.credential_status as enum (
    'pending',
    'issued',
    'revoked',
    'expired'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ticket_status as enum (
    'open',
    'in_progress',
    'waiting_for_requester',
    'resolved',
    'closed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.financial_status as enum (
    'pending',
    'authorized',
    'paid',
    'failed',
    'cancelled',
    'partially_refunded',
    'refunded',
    'disputed'
  );
exception when duplicate_object then null;
end $$;

-- Shared timestamp helper

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Identity and role records

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  location text,
  avatar_path text,
  status text not null default 'active' check (status in ('active', 'invited', 'suspended', 'deactivated')),
  legacy_source text,
  legacy_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_lower_unique
  on public.profiles (lower(email));

create unique index if not exists profiles_legacy_unique
  on public.profiles (legacy_source, legacy_id)
  where legacy_id is not null;

create table if not exists public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  is_active boolean not null default true,
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  notes text,
  unique (user_id, role)
);

-- Programs and cohorts

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  delivery_model text not null default 'guided',
  is_published boolean not null default false,
  is_accepting_applications boolean not null default false,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.program_tracks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, slug)
);

create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete restrict,
  name text not null,
  code text unique,
  starts_at timestamptz,
  ends_at timestamptz,
  application_deadline timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'planning' check (status in ('planning', 'open', 'closed', 'active', 'completed', 'cancelled')),
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Applications and admissions

create sequence if not exists public.application_number_seq start with 1;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  application_number text unique,
  applicant_user_id uuid references auth.users(id) on delete set null,
  program_id uuid references public.programs(id) on delete set null,
  track_id uuid references public.program_tracks(id) on delete set null,
  cohort_id uuid references public.cohorts(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  location text,
  occupation text,
  ai_skill_level smallint check (ai_skill_level between 1 and 10),
  tech_skill_level smallint check (tech_skill_level between 1 and 10),
  available_hours integer check (available_hours between 1 and 80),
  why_apply text,
  production_goals text,
  status public.application_status not null default 'new',
  source_page text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  decided_at timestamptz,
  assigned_reviewer_id uuid references public.profiles(id) on delete set null,
  legacy_source text,
  legacy_id text,
  legacy_created_at timestamptz,
  migration_batch_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_status_idx on public.applications(status, submitted_at desc);
create index if not exists applications_email_lower_idx on public.applications(lower(email));
create unique index if not exists applications_legacy_unique
  on public.applications (legacy_source, legacy_id)
  where legacy_id is not null;

create or replace function public.assign_application_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.application_number is null or btrim(new.application_number) = '' then
    new.application_number :=
      'COG-APP-' || to_char(coalesce(new.submitted_at, now()), 'YYYY') || '-' ||
      lpad(nextval('public.application_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create table if not exists public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  from_status public.application_status,
  to_status public.application_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create or replace function public.record_application_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.application_status_history(application_id, from_status, to_status, changed_by, reason)
    values (new.id, null, new.status, auth.uid(), 'Application created');
  elsif new.status is distinct from old.status then
    insert into public.application_status_history(application_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30 check (duration_minutes between 10 and 240),
  meeting_url text,
  interviewer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  outcome text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admissions_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null,
  is_decision_note boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Consent and privacy records

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  application_id uuid references public.applications(id) on delete cascade,
  email text,
  consent_type text not null,
  policy_version text not null,
  accepted boolean not null,
  accepted_at timestamptz not null default now(),
  source_page text,
  ip_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now()
);

-- Enrollment and access

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  application_id uuid references public.applications(id) on delete set null,
  cohort_id uuid not null references public.cohorts(id) on delete restrict,
  track_id uuid references public.program_tracks(id) on delete set null,
  status public.enrollment_status not null default 'pending',
  agreement_version text,
  agreement_accepted_at timestamptz,
  enrolled_at timestamptz,
  completed_at timestamptz,
  withdrawn_at timestamptz,
  legacy_source text,
  legacy_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, cohort_id)
);

create table if not exists public.access_entitlements (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  entitlement_type text not null default 'program_access',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  suspended_at timestamptz,
  revoked_at timestamptz,
  reason text,
  granted_by uuid references public.profiles(id) on delete set null,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Learning, evidence, and human review

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  track_id uuid references public.program_tracks(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  content jsonb not null default '{}'::jsonb,
  week_number integer check (week_number is null or week_number > 0),
  display_order integer not null default 0,
  version integer not null default 1,
  is_published boolean not null default false,
  published_at timestamptz,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, slug, version)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  status public.submission_status not null default 'draft',
  current_version integer not null default 0,
  assigned_reviewer_id uuid references public.profiles(id) on delete set null,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  legacy_source text,
  legacy_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submission_versions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  submitted_by uuid not null references public.profiles(id) on delete restrict,
  text_content text,
  file_paths jsonb not null default '[]'::jsonb,
  checksum text,
  reviewer_findings jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  is_locked boolean not null default true,
  legacy_source text,
  legacy_id text,
  unique (submission_id, version_number)
);

create table if not exists public.portfolio_audits (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  reviewer_id uuid references public.profiles(id) on delete set null,
  approver_id uuid references public.profiles(id) on delete set null,
  decision public.audit_decision not null default 'pending',
  rubric jsonb not null default '{}'::jsonb,
  reviewer_attested boolean not null default false,
  conflict_checked boolean not null default false,
  decision_notes text,
  submitted_at timestamptz,
  decided_at timestamptz,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Credentials

create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  enrollment_id uuid not null references public.enrollments(id) on delete restrict,
  portfolio_audit_id uuid not null references public.portfolio_audits(id) on delete restrict,
  serial_number text not null unique,
  credential_title text not null default 'Certificate of Completion',
  status public.credential_status not null default 'pending',
  issued_at timestamptz,
  issued_by uuid references public.profiles(id) on delete set null,
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id) on delete set null,
  revocation_reason text,
  expires_at timestamptz,
  public_metadata jsonb not null default '{}'::jsonb,
  private_file_path text,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Support

create sequence if not exists public.support_reference_seq start with 1;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique,
  requester_id uuid references public.profiles(id) on delete set null,
  requester_email text,
  category text not null,
  subject text not null,
  description text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status public.ticket_status not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.assign_support_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.reference_number is null or btrim(new.reference_number) = '' then
    new.reference_number :=
      'COG-SUP-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.support_reference_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

-- Finance records. These tables do not authorize browser-side payment activation.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete set null,
  student_id uuid references public.profiles(id) on delete set null,
  provider text,
  provider_reference text,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'PHP',
  status public.financial_status not null default 'pending',
  paid_at timestamptz,
  reconciled_at timestamptz,
  reconciled_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_reference)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete set null,
  student_id uuid references public.profiles(id) on delete set null,
  invoice_number text not null unique,
  amount_due numeric(12,2) not null check (amount_due >= 0),
  currency text not null default 'PHP',
  status text not null default 'draft' check (status in ('draft', 'issued', 'partially_paid', 'paid', 'void', 'overdue')),
  issued_at timestamptz,
  due_at timestamptz,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete restrict,
  receipt_number text not null unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'PHP',
  issued_at timestamptz not null default now(),
  issued_by uuid references public.profiles(id) on delete set null,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'PHP',
  status public.financial_status not null default 'pending',
  reason text not null,
  provider_reference text,
  approved_by uuid references public.profiles(id) on delete set null,
  processed_at timestamptz,
  legacy_source text,
  legacy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Communications, delivery, and audit

create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  template_key text not null,
  subject text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed', 'cancelled')),
  provider_message_id text,
  attempt_count integer not null default 0,
  last_error text,
  next_attempt_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  table_name text,
  record_id text,
  before_data jsonb,
  after_data jsonb,
  request_id text,
  ip_hash text,
  created_at timestamptz not null default now()
);

-- Triggers

drop trigger if exists applications_assign_number on public.applications;
create trigger applications_assign_number
before insert on public.applications
for each row execute function public.assign_application_number();

drop trigger if exists applications_status_history_insert on public.applications;
create trigger applications_status_history_insert
after insert on public.applications
for each row execute function public.record_application_status_change();

drop trigger if exists applications_status_history_update on public.applications;
create trigger applications_status_history_update
after update of status on public.applications
for each row execute function public.record_application_status_change();

drop trigger if exists support_assign_reference on public.support_tickets;
create trigger support_assign_reference
before insert on public.support_tickets
for each row execute function public.assign_support_reference();

-- updated_at triggers

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'programs', 'program_tracks', 'cohorts', 'applications',
    'interviews', 'admissions_notes', 'enrollments', 'access_entitlements',
    'lessons', 'lesson_progress', 'submissions', 'portfolio_audits',
    'credentials', 'support_tickets', 'payments', 'invoices', 'refunds',
    'email_outbox'
  ]
  loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

-- Minimal seed data. Review names and publication state before production.

insert into public.programs (name, slug, description, delivery_model, is_published, is_accepting_applications)
values
  ('Cognita Open Learning', 'open-learning', 'Structured self-paced AI learning.', 'self-paced', true, false),
  ('Cognita Professional Programs', 'professional-programs', 'Facilitator-guided professional AI programs.', 'guided', true, false),
  ('Cognita Assessment and Credentialing', 'assessment-credentialing', 'Human review and evidence-based credential services.', 'assessment', true, false),
  ('Cognita Institutional Training', 'institutional-training', 'Customized training for organizations.', 'institutional', true, false)
on conflict (slug) do nothing;
