# Cognita Base44 to Supabase Migration

Status: preparation branch only

Target branch: `migration/supabase-independence`

Production rule: do not merge this branch into `main` until the Supabase project, database migrations, authentication, storage policies, Edge Functions, applicant workflow, and rollback procedure have been tested.

## Objective

Move Cognita Institute away from Base44 while preserving the existing React/Vite website, public pages, brand assets, application form, dashboards, and learner workflows.

Cognita will own and control:

- source code in GitHub;
- database schema and migration history;
- authentication configuration;
- application and learner records;
- private file-storage rules;
- server-side functions;
- domain and deployment configuration;
- email templates and delivery provider;
- audit and credential-verification logic.

## Target architecture

| Layer | Target |
| --- | --- |
| Public website | Existing React/Vite frontend |
| Frontend deployment | Cloudflare Pages or the approved production host |
| Database | Supabase Postgres |
| Authentication | Supabase Auth |
| Authorization | Postgres Row Level Security plus server-side role checks |
| Applicant intake | `submit-application` Supabase Edge Function |
| Private files | Supabase Storage with private buckets and RLS |
| Transactional email | Cognita-owned provider connected through Edge Functions |
| Admin operations | Existing Cognita dashboards rewritten against Supabase |
| Audit trail | Append-only `audit_log` records |
| Credentials | Restricted serial-number verification function |

## Migration principles

1. No full visual rewrite.
2. No production cutover until parity is proven.
3. No service-role key in frontend code, GitHub, screenshots, or chat.
4. No direct anonymous access to applicant records.
5. No direct public table listing for credentials.
6. No automatic enrollment, payment activation, or credential issuance without protected server-side checks.
7. Base44 remains available as the temporary fallback until final acceptance testing is complete.
8. Every schema change is stored as a version-controlled SQL migration.

## Prepared in this branch

- Supabase core database schema;
- Row Level Security policies and role helpers;
- application-number generation;
- applicant status history;
- admissions, enrollment, learning, submission, portfolio, credential, support, finance, consent, email, and audit tables;
- a secure application-submission Edge Function scaffold;
- optional Cloudflare Turnstile verification;
- optional transactional email delivery scaffold;
- a Base44-to-Supabase entity map;
- data-export validation tooling;
- frontend Supabase client and AuthContext templates;
- environment-variable inventory;
- migration, testing, cutover, and rollback checklists.

## Workstreams

### 1. Project and environment

- Create or identify the Cognita Supabase project.
- Record the project reference privately.
- Link the repository with the Supabase CLI.
- Store only public frontend values in the production host.
- Store service-role and email-provider secrets only in Supabase secrets.

### 2. Database

Run and review the files under `supabase/migrations/` locally before pushing them to a remote project.

Required checks:

- migrations apply from an empty database;
- migrations are repeatable through `supabase db reset`;
- all exposed tables have RLS enabled;
- public users cannot enumerate applicants, users, submissions, payments, or credentials;
- staff access matches Cognita's approved role matrix.

### 3. Applicant intake

The first production milestone is independent applicant intake:

`Website form -> Edge Function -> applications table -> application number -> confirmation email -> admissions dashboard`

Do not switch the public form until the following pass:

- successful submission;
- duplicate submission handling;
- invalid payload rejection;
- bot protection;
- email confirmation;
- admissions visibility;
- status update and history;
- privacy and consent recording;
- failure and retry logging.

### 4. Authentication and roles

Replace Base44 Auth only after Cognita has tested:

- sign-up and invitation;
- email verification;
- login and logout;
- password reset and account recovery;
- expired sessions;
- administrator, admissions, registrar, facilitator, reviewer, support, finance, and student isolation;
- removal and suspension of access.

### 5. Learning and records

Migrate in this order:

1. programs and tracks;
2. cohorts;
3. learner profiles;
4. enrollments and access entitlements;
5. lessons and progress;
6. submissions and immutable versions;
7. portfolio audits;
8. credentials and revocations;
9. support and communications;
10. financial records.

### 6. Data migration

- Export Base44 records without deleting or editing the source.
- Preserve original IDs in `legacy_source` and `legacy_id` fields where available.
- Validate counts before transformation.
- Import reference data before dependent records.
- Reconcile row counts, relationships, status values, timestamps, and file links.
- Keep a signed migration report containing exported, transformed, imported, rejected, and reconciled counts.

### 7. Cutover

The final switch must occur during a controlled window:

1. freeze Base44 writes;
2. take final export and backups;
3. import changes since the rehearsal export;
4. run integrity and RLS tests;
5. switch frontend environment to Supabase;
6. deploy the approved frontend;
7. verify domain, forms, login, email, dashboards, and files;
8. monitor errors and submissions;
9. retain Base44 in read-only fallback mode until the rollback window closes.

## Required private values before deployment

These values must be obtained from the Cognita Supabase project and approved service providers. Do not commit them.

Frontend-safe:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_BACKEND_PROVIDER=supabase`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` or approved email-provider key
- `COGNITA_FROM_EMAIL`
- `COGNITA_ADMISSIONS_EMAIL`
- `ALLOWED_ORIGINS`
- `TURNSTILE_SECRET_KEY`

## Definition of ready to merge

This migration branch is ready to merge only when:

- the draft pull request has been reviewed;
- SQL migrations pass locally and remotely;
- RLS tests prove role isolation;
- applicant submission works on a preview domain;
- Cognita receives confirmation and internal notification emails;
- admin review works without Base44;
- Base44-dependent imports have replacements or feature flags;
- a tested rollback procedure exists;
- no private secret is present in the repository;
- the founder gives explicit approval for production cutover.
