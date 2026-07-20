# Cognita Institute

> **Repository status: Legacy mirror**
>
> The active Cognita source is now maintained in `masinlocandher-max/Withlovefmb` under `apps/cognita`.
>
> Do not make new production changes in this standalone repository. Keep it as a temporary historical backup until the monorepo deployment and full file-parity checks are complete. Never commit environment files, API secrets, database credentials, private learner records, or conversation data here.

Cognita is a Base44-built React/Vite application for AI education, applications, enrollment, lessons, quizzes, submissions, certificates, messaging, payments, and role-based dashboards.

## Repository status and history

This repository was created from a manual Base44 ZIP export. It now serves only as a legacy backup and historical record.

The governed source of truth is:

```text
masinlocandher-max/Withlovefmb
└── apps/cognita
```

Automatic two-way synchronization with the Base44 Builder has not been verified, so a GitHub change must not be assumed to appear in Base44 or on the live application automatically.

## Main project areas

- `src/`: React frontend
- `src/pages/`: public, admin, facilitator, and student pages
- `src/components/`: shared interface and curriculum components
- `base44/entities/`: Base44 entity schemas
- `base44/workflows/`: lifecycle email workflows
- `base44/functions/`: Base44 server functions
- `AUDIT.md`: technical status, resolved issues, and remaining risks

## Local setup

Requirements:

- Node.js 20 or newer
- npm

Install and verify:

```bash
npm ci
npm run lint
npm run typecheck
npm audit --audit-level=moderate
npm run build
```

Run the frontend locally:

```bash
npm run dev
```

For frontend-only development against a hosted Base44 backend, create a local `.env.local` file:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

Never commit `.env` files or private credentials.

## Base44 development

The project includes Base44 app metadata, entity schemas, workflows, and a server function. Base44 CLI development may be available through:

```bash
base44 dev
```

Backend permissions, authentication roles, workflows, and the server function must still be tested in an actual Base44 environment. A successful frontend build does not prove that backend access controls are correct.

## Release rule

Do not treat Cognita as ready for paying users until the following have passed:

1. Admin, facilitator, and student role-isolation tests
2. Application and enrollment testing
3. Payment, invoice, receipt, and refund testing
4. Lesson, quiz, submission, and certificate testing
5. Email workflow testing
6. Password-reset and account-recovery testing
7. Base44 backend permission review

See `AUDIT.md` for the current verified status.
