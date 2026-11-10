# Andalusia Academy LMS

Learning management system for Andalusia Academy: public catalog, admissions, payments, enrollment, and the
learner, instructor and admin portals.

| Layer | Stack | Folder |
| :--- | :--- | :--- |
| API | ASP.NET Core 10, EF Core 10, SQL Server | `AndalusiaAcademy.API/` |
| Web app | React 19, TypeScript, Vite, TanStack Query | `frontend/` |
| Tests | xUnit + WebApplicationFactory (real SQL Server), Vitest | `AndalusiaAcademy.Tests/`, `frontend/src/__tests__/` |

Architecture, ADRs and the sprint plan: [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md).
API reference and permission matrix: [`docs/api/SPRINT_3_4_API.md`](docs/api/SPRINT_3_4_API.md). ERD: [`docs/architecture/ERD_v3_v4.md`](docs/architecture/ERD_v3_v4.md).

## Prerequisites

- .NET 10 SDK and the EF Core CLI: `dotnet tool install --global dotnet-ef`
- SQL Server: LocalDB on Windows, or Docker (`mcr.microsoft.com/mssql/server:2022-latest`)
- Node.js 22

## Run locally

### 1. API

```bash
cd AndalusiaAcademy.API

# Secrets live in user-secrets, never in appsettings*.json
dotnet user-secrets set "Jwt:SigningKey" "<random value, at least 32 characters>"
dotnet user-secrets set "Seed:DemoData:Password" "<password for the demo accounts>"   # optional
# Only if you don't use the connection string in appsettings.Development.json:
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your SQL Server connection string>"

dotnet ef database update
dotnet run          # https://localhost:59372 — Swagger UI at /swagger (Development)
```

In Development the API seeds the catalog (courses, programs, career paths) and, when `Seed:DemoData:Password`
is set, four demo accounts that share that password:

| Role | E-mail |
| :--- | :--- |
| Admin | `admin@demo.andalusia.local` |
| Instructor (assigned to the demo cohort) | `instructor@demo.andalusia.local` |
| Learner | `learner@demo.andalusia.local` |
| Content manager | `content@demo.andalusia.local` |

The payment simulation and the in-response password-reset token are enabled only in Development
(`appsettings.Development.json`).

### Stripe webhook testing

The API accepts signed Stripe events at `POST /api/payments/webhook`. Store the signing secret in
user-secrets instead of committing it:

```bash
dotnet user-secrets set "Payments:StripeWebhookSecret" "<whsec_...>"
stripe login
stripe listen --forward-to https://localhost:59372/api/payments/webhook
```

The frontend passes the LMS sales-order GUID as Stripe `client_reference_id`. Server-created
Checkout Sessions may use either `client_reference_id` or `metadata.orderId`. Use Stripe CLI
overrides or a signed test payload with a real pending order GUID to test settlement.

Webhook behaviour:

- Subscribe the endpoint to `checkout.session.completed` and
  `checkout.session.async_payment_succeeded` (delayed payment methods settle through the latter).
  Other event types are acknowledged and ignored.
- Deployed environments read the signing secret from the `Payments__StripeWebhookSecret` app
  setting. Without it the endpoint answers `503` and nothing is settled.
- Every verified delivery is stored in `WebhookInbox` (`Received` → `Processed` / `Failed` with
  `LastError`). Failures answer non-2xx so Stripe redelivers; settlement is idempotent per event
  and per payment.
- The paid amount and currency must equal the sales order. A mismatch, an unknown order, or a
  seat that was given away after the hold lapsed is **not** fulfilled: it is logged as an error,
  left `Failed` in the inbox and needs a manual refund or review in Stripe.
- The Buy Button charges one fixed Stripe price, so only offerings with exactly that price and
  currency can be paid through it.

The web app's Buy Button uses sandbox identifiers by default; set `VITE_STRIPE_BUY_BUTTON_ID` and
`VITE_STRIPE_PUBLISHABLE_KEY` at build time to target another Stripe account or live mode.

### 2. Web app

```bash
cd frontend
npm ci
npm run dev        # http://127.0.0.1:5173, proxies /api to the API
```

If the API runs on another address: `VITE_API_PROXY_TARGET=http://localhost:5080 npm run dev`.

## Tests

```bash
# Backend: unit + integration tests against a throw-away SQL Server database per run
export ANDALUSIA_TEST_SQL_SERVER="Server=localhost,1433;User Id=sa;Password=<sa password>;TrustServerCertificate=True"
#   LocalDB: "Server=(localdb)\\mssqllocaldb;Trusted_Connection=True;TrustServerCertificate=True"
dotnet test

# Frontend
cd frontend && npm run typecheck && npm test && npm run build
```

CI (`.github/workflows/ci.yml`) runs `dotnet format --verify-no-changes`, the build and tests against a SQL Server
container, and the frontend type-check, tests and build.

## Sprint demo walkthrough

1. **Sprint 3:** sign up at `/signup` → open a course from `/courses` → *Enroll* → approve the simulated payment →
   `/dashboard` shows the course under My Learning, and the Applications and Payments tabs show the records. Visiting `/admin` as a learner is blocked.
2. **Sprint 4:**
   - **Learner:** *Open Course* → materials, sessions with locations, assignments (submit) and progress.
   - **Instructor** (`/instructor`): cohort → take attendance, create or grade assignments, learner progress.
   - **Admin** (`/admin`): students, instructors, courses, offerings with sessions, materials and instructors, locations, payments.
