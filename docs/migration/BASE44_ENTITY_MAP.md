# Base44 to Supabase Entity Map

This mapping is the planned migration contract. Exact Base44 export filenames and field names must be confirmed against the final export before any production import.

| Base44 area or known entity | Supabase target | Migration rule |
| --- | --- | --- |
| User | `profiles` and Supabase Auth | Create Auth users through an approved admin process, then link profile records. Never copy passwords. |
| ConsentRecord | `consent_records` | Preserve policy versions, timestamps, source page, IP/user-agent metadata when legally appropriate. |
| Waitlist | `applications` | Import as an application with the closest matching status and retain the Base44 ID. |
| Lead used for admissions fallback | `applications` | Import only records whose source or interest type represents Cognita applications or waitlist interest. |
| Application | `applications` | Preserve submitted answers, status, track, timestamps, and internal notes separately. |
| Batch | `cohorts` | Preserve cohort name, schedule, capacity, and lifecycle status. |
| Program | `programs` | Deduplicate by stable slug. |
| Track or specialization | `program_tracks` | Link to the correct program before importing applications and enrollments. |
| Enrollment | `enrollments` | Link user, cohort, application, status, and agreement dates. |
| AccessEntitlement | `access_entitlements` | Preserve activation, expiry, suspension, revocation, waiver, and reason fields. |
| Lesson | `lessons` | Preserve order, version, visibility, content, and release rules. |
| Lesson progress | `lesson_progress` | Link student and lesson; preserve completion timestamps and progress percentage. |
| Quiz | planned assessment tables | Import after the assessment schema is finalized. Do not flatten attempts into lesson progress. |
| Quiz attempt | planned assessment-attempt tables | Preserve attempt number, score, answers, timestamps, and reviewer state. |
| Submission | `submissions` | Import current submission record and ownership. |
| SubmissionVersion | `submission_versions` | Preserve immutable versions, file paths, timestamps, and submitter. |
| PortfolioAudit | `portfolio_audits` | Preserve reviewer, rubric, decision, attestation, conflict check, and decision timestamp. |
| Certificate | `credentials` | Preserve serial, issue/revoke dates, audit relationship, and public-verification fields. |
| SupportTicket | `support_tickets` | Preserve reference number, category, priority, status, requester, assignee, and history. |
| Announcement | future communications table | Migrate after audience and visibility rules are defined. |
| Message | future messaging tables | Migrate only after participant-level RLS has been tested. |
| Payment | `payments` | Preserve provider reference, amount, currency, status, payer, and reconciliation metadata. |
| Invoice | `invoices` | Preserve number, dates, totals, status, and source transaction. |
| Receipt | `receipts` | Preserve number, issue date, amount, and linked payment. |
| Refund | `refunds` | Preserve amount, reason, status, provider reference, and approval record. |
| Lifecycle email workflow | Edge Function plus `email_outbox` | Rebuild as server-side templates and logged delivery attempts. |
| Base44 server function | Supabase Edge Function | Rewrite with explicit authentication, authorization, validation, idempotency, and audit logging. |
| Base44 file URL | Supabase Storage object | Download, checksum, upload to a private bucket, verify, then update the owning record. |

## Legacy identity fields

Every migrated business table should retain these fields when the source provides them:

- `legacy_source`, normally `base44`;
- `legacy_id`;
- `legacy_created_at` when the original timestamp differs from the import timestamp;
- `migration_batch_id`;
- `migration_notes` for rejected, transformed, or manually reconciled records.

Do not use legacy IDs as new primary keys. Supabase uses UUID primary keys so future records are independent of Base44.

## Import dependency order

1. programs;
2. program tracks;
3. cohorts;
4. Auth users and profiles;
5. staff roles;
6. applications and consent records;
7. enrollments and access entitlements;
8. lessons;
9. lesson progress;
10. submissions;
11. submission versions;
12. portfolio audits;
13. credentials;
14. support records;
15. finance records;
16. communications and files.

## Reconciliation requirements

For each entity, record:

- exported count;
- accepted count;
- transformed count;
- imported count;
- rejected count;
- duplicate count;
- orphaned relationship count;
- manually resolved count;
- final source-to-target variance.

No entity is considered migrated while unexplained variance remains.
