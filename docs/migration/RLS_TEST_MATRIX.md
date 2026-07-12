# Cognita Supabase RLS Test Matrix

Every row below must be tested with a separate real test account. Frontend route hiding does not count as authorization evidence.

Legend:

- R: read
- C: create
- U: update
- D: delete
- RPC: approved protected function only
- None: request must fail

| Resource | Anonymous | Applicant | Student | Facilitator | Reviewer | Admissions | Registrar | Support | Finance | Admin | Founder |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Published programs and tracks | R | R | R | R | R | R | R | R | R | CRUD | CRUD |
| Applications | RPC only | own R after account link | own R when linked | None | None | R | RU | None | None | RU | RU |
| Admissions notes | None | None | None | None | None | CRUD | CRUD | None | None | CRUD | CRUD |
| Interviews | None | own R | own R when linked | None | None | CRUD | CRUD | None | None | CRUD | CRUD |
| Profiles | None | own RU | own RU | R as assigned workflow allows | R as assigned workflow allows | R | R | R | R | CRUD | CRUD |
| Staff roles | None | own R if staff | own R if staff | own R | own R | own R | own R | own R | own R | R | CRUD |
| Enrollments | None | None | own R | R assigned | R assigned | None | CRUD | R | R | CRUD | CRUD |
| Access entitlements | None | None | own R | R assigned | None | None | CRUD | R | R | CRUD | CRUD |
| Lessons | published R | published R | published R | CRUD | CRUD | R | R | R | R | CRUD | CRUD |
| Lesson progress | None | None | own CRU | R assigned | R assigned | None | R | R support-only | None | CRUD | CRUD |
| Submissions | None | None | own CRU under state rules | RU assigned | RU assigned | None | R | None | None | CRUD | CRUD |
| Submission versions | None | None | own CR, no overwrite | R assigned | R assigned | None | R | None | None | CRUD | CRUD |
| Portfolio audits | None | None | own R | R assigned if approved | CRUD assigned | None | R | None | None | CRUD | CRUD |
| Credentials | serial RPC only | serial RPC only | own R | None | R | None | CRUD after approved audit | None | None | CRUD | CRUD |
| Support tickets | None or protected RPC | own CR | own CR | None | None | None | None | CRUD | None | CRUD | CRUD |
| Payments | None | None | own R | None | None | None | R | None | CRUD | CRUD | CRUD |
| Invoices and receipts | None | None | own R | None | None | None | R | None | CRUD | CRUD | CRUD |
| Refunds | None | None | own R | None | None | None | R | None | CRUD | CRUD | CRUD |
| Email outbox | None | None | None | None | None | None | None | None | None | R | R |
| Audit log | None | None | None | None | None | None | None | None | None | R | R |
| Applicant documents | None except protected upload flow | own CR | own R when linked | None | None | R | R | None | None | CRUD | CRUD |
| Learner submissions storage | None | None | own CR, no overwrite | R assigned | R assigned | None | R if necessary | None | None | CRUD | CRUD |
| Credential files | None | None | own R | None | None | None | CRUD | None | None | CRUD | CRUD |

## Required negative tests

For every protected resource, test all of the following:

1. no access token;
2. expired access token;
3. token for the wrong user;
4. user with the wrong staff role;
5. suspended user;
6. deactivated user;
7. changed record ID in the request;
8. changed storage path prefix;
9. direct REST request outside the UI;
10. bulk list request;
11. filter bypass attempt;
12. update that changes record ownership;
13. delete when only update is permitted;
14. role revoked during an active session;
15. service-role key absent from all browser requests.

## Credential verification tests

The public `verify_credential` function must:

- require an exact serial number;
- return no directory or search suggestions;
- return only the approved public fields;
- show revoked and expired states accurately;
- reveal no email, phone, address, internal notes, payment record, rubric, reviewer identity, or file path;
- be protected by rate limiting at the edge;
- log abuse signals without storing raw IP addresses unnecessarily.

## Evidence to retain

For each role and test case, retain:

- test account identifier;
- date and environment;
- request or test name;
- expected result;
- actual result;
- screenshot or sanitized response;
- reviewer;
- remediation reference for failures;
- final sign-off.
