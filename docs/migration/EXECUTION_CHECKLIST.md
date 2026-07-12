# Cognita Migration Execution Checklist

Use this checklist as the release record. Add dates, owners, evidence links, and pass/fail results before production cutover.

## Phase 0: Governance

- [ ] Confirm legal operator and official privacy contact.
- [ ] Confirm official admissions email: `cognitainstituteofai@gmail.com`.
- [ ] Approve the public applicant privacy notice.
- [ ] Approve data retention and deletion periods.
- [ ] Approve staff roles and access matrix.
- [ ] Approve incident-response and rollback owners.
- [ ] Confirm no proposed or generated staff identity is represented as a verified employee without consent.

## Phase 1: Supabase project

- [ ] Create or identify the Cognita Supabase project.
- [ ] Record the project reference in the private operations vault.
- [ ] Enable MFA for project administrators.
- [ ] Restrict organization and project membership.
- [ ] Link the repository locally with `supabase link --project-ref <project-ref>`.
- [ ] Pull any pre-existing remote schema before pushing new migrations.
- [ ] Configure backup and point-in-time recovery appropriate to the plan.
- [ ] Configure custom SMTP before production Auth email.

## Phase 2: Local database validation

- [ ] Install or update the Supabase CLI.
- [ ] Run `supabase start`.
- [ ] Run `supabase db reset` from an empty local database.
- [ ] Verify every migration applies without manual edits.
- [ ] Verify all public-schema business tables have RLS enabled.
- [ ] Run role-isolation tests for anon, applicant, student, facilitator, reviewer, admissions, registrar, support, finance, admin, and founder.
- [ ] Confirm service-role operations are limited to Edge Functions and controlled administration.
- [ ] Confirm credential verification returns minimum public information only.

## Phase 3: Applicant intake milestone

- [ ] Deploy `submit-application` to a non-production Supabase project or branch.
- [ ] Set server-side secrets with `supabase secrets set`.
- [ ] Configure allowed production and preview origins.
- [ ] Configure Cloudflare Turnstile or approved bot protection.
- [ ] Configure the official sender and admissions recipient.
- [ ] Submit a valid application from the preview site.
- [ ] Confirm a unique `COG-APP-YYYY-######` reference is generated.
- [ ] Confirm the application is visible to admissions staff only.
- [ ] Confirm consent records are stored with policy versions.
- [ ] Confirm applicant receipt email is delivered.
- [ ] Confirm admissions notification is delivered.
- [ ] Confirm duplicate, malformed, oversized, automated, and disallowed-origin requests are rejected safely.
- [ ] Confirm application errors do not expose stack traces or private configuration.

## Phase 4: Authentication

- [ ] Configure site URL and approved redirect URLs.
- [ ] Test email verification.
- [ ] Test invitation flow.
- [ ] Test password reset and account recovery.
- [ ] Test logout and expired sessions.
- [ ] Test suspended and deactivated accounts.
- [ ] Create separate test accounts for every role.
- [ ] Verify students cannot read other students' records.
- [ ] Verify facilitators can access only assigned learners or cohorts.
- [ ] Verify reviewers cannot change finance or enrollment records.
- [ ] Verify finance cannot change academic decisions.
- [ ] Verify support cannot change grades, credentials, or payments.
- [ ] Verify registrar cannot issue a credential without an approved audit.

## Phase 5: Storage

- [ ] Create private buckets for applicant documents, learner submissions, portfolio evidence, credential files, and staff assets as approved.
- [ ] Define file-size and MIME-type limits.
- [ ] Test upload, signed access, replacement, deletion, and expiry.
- [ ] Verify public users cannot list private objects.
- [ ] Verify users cannot change storage paths to access another person's files.
- [ ] Record checksums for migrated files.

## Phase 6: Data rehearsal

- [ ] Export Base44 data without modifying the source.
- [ ] Save the export checksum and timestamp.
- [ ] Run `migration/scripts/validate-base44-export.mjs`.
- [ ] Confirm exact source entity filenames and fields.
- [ ] Update `migration/entity-map.json` if the export differs.
- [ ] Transform and import into a disposable Supabase environment.
- [ ] Reconcile row counts and foreign-key relationships.
- [ ] Reconcile dates, time zones, statuses, money, serial numbers, and file ownership.
- [ ] Document every rejected or manually corrected record.
- [ ] Conduct staff acceptance testing against migrated data.

## Phase 7: Frontend conversion

- [ ] Install `@supabase/supabase-js` and update the lockfile.
- [ ] Add the approved `supabaseClient` implementation.
- [ ] Replace Base44 AuthContext behind a feature flag.
- [ ] Replace applicant submission first.
- [ ] Replace entity calls page by page.
- [ ] Replace file operations.
- [ ] Replace server functions and lifecycle email workflows.
- [ ] Remove Base44 Vite plugin only after all legacy imports are gone.
- [ ] Remove `@base44/sdk` only after code search and build verification show no remaining dependency.
- [ ] Run lint, typecheck, dependency audit, and production build.

## Phase 8: Preview acceptance

- [ ] Deploy to a protected preview domain.
- [ ] Test desktop and mobile navigation.
- [ ] Test all public pages and forms.
- [ ] Test applicant, student, facilitator, reviewer, registrar, support, finance, and admin journeys.
- [ ] Test private-file access.
- [ ] Test emails and failure handling.
- [ ] Test credential verification and revocation.
- [ ] Test analytics and error monitoring without collecting prohibited personal data.
- [ ] Obtain founder approval for cutover.

## Phase 9: Production cutover

- [ ] Announce a maintenance window.
- [ ] Disable or freeze Base44 writes.
- [ ] Take final Base44 export and backup.
- [ ] Import the final delta.
- [ ] Run production reconciliation.
- [ ] Push final migrations.
- [ ] Deploy Edge Functions.
- [ ] Set production frontend environment to Supabase.
- [ ] Deploy the approved frontend.
- [ ] Verify `thecognitainstitute.com` and `www` routing.
- [ ] Verify TLS, forms, Auth, email, dashboards, files, and monitoring.
- [ ] Keep Base44 read-only during the rollback window.

## Phase 10: Retirement

- [ ] Confirm the rollback window has closed.
- [ ] Export and archive the final Base44 snapshot.
- [ ] Remove Base44 secrets from all hosts.
- [ ] Remove Base44 dependencies and plugin configuration.
- [ ] Remove obsolete Base44 workflows and functions only after archive verification.
- [ ] Update architecture, privacy, processor, backup, and recovery documentation.
- [ ] Record final migration approval and date.
