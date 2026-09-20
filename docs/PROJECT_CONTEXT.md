# Andalusia Academy LMS - Project Context & Architectural Baseline

> **Last Updated**: September 20, 2026  
> **Repository**: [TheDev20/andalusia-academy-LMS](https://github.com/TheDev20/andalusia-academy-LMS)  
> **Primary Working Branch**: `develop`  

---

## 1. Project Overview & Scope Boundaries

**Andalusia Academy LMS** is an enterprise-grade learning management system designed for physical and hybrid academy operations. 

### Phase 1 MVB (Minimum Viable Baseline) Scope
* **Core Visitor-to-Learner Journey**:
  1. Public course and program discovery and comparison.
  2. Student application submission.
  3. Admission review and seat reservation.
  4. Hosted checkout and payment verification.
  5. Automated enrollment fulfillment.
  6. Access to private learning resources, attendance tracking, and assignment submissions.
* **7 Business Domain Modules**:
  1. **Identity**: User accounts, authentication (cookies/JWT), roles, permissions, profile management.
  2. **Catalog & Content**: Courses, programs, career paths, categories, offerings, public pages.
  3. **Admissions**: Applications, seat capacity reservations, admission decisions, enrollment records.
  4. **Learning**: Sessions, attendance, instructors, private resources, submissions, progress tracking.
  5. **Payments**: Sales orders, payment attempts, provider webhook inbox, idempotency, reconciliation.
  6. **Compensation**: Instructor agreements (fixed/hourly), earning records, payout allocation.
  7. **Operations & CMS**: KPIs, reports, announcements, audit trails, outbox notifications, editable CMS content.



---

## 2. System Architecture & Tech Stack

### Technology Matrix
| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend API** | ASP.NET Core 10 LTS | Modular Monolith (`AndalusiaAcademy.API`), explicit module namespaces |
| **Data Access** | EF Core 10 | Code-First migrations, module-specific Fluent API configurations |
| **Database** | Microsoft SQL Server | Hosted on Azure SQL Database |
| **Background Worker** | .NET 10 BackgroundService | `AndalusiaAcademy.Worker` for Outbox, seat expiry, reconciliation |
| **Frontend** | React 19 + TypeScript | Vite build toolchain, feature-based modular folder organization |
| **Testing** | xUnit, Moq, Testcontainers | `AndalusiaAcademy.Tests` (Unit & Integration tests) |
| **Hosting** | Azure App Service | `AndalusiaAcademyLMS` (Linux / .NET 10) |

### Key Architectural Decisions (ADRs)
* **ADR 001 - Modular Monolith**: Single deployable API with explicit module ownership. No microservice operational overhead.
* **ADR 002 - Course vs Offering Separation**: A `Course` is a catalog curriculum; an `Offering` is a scheduled intake with specific pricing, dates, and capacity.
* **ADR 003 - Independent Lifecycles**: Application, Payment, and Enrollment are decoupled state machines linked via foreign keys.
* **ADR 004 - Transactional Capacity & No Overselling**: Seat reservations acquire SQL locks in consistent order with expiration timeouts.
* **ADR 005 - Durable Outbox & Webhook Inbox**: Reliable messaging via transactional Outbox and deduplicated WebhookInbox.
* **ADR 006 - Reviewed Code-First Migrations**: Migrations are version-controlled, tested, and applied via CI/CD pipelines.

---

## 3. Team Collaboration & Git Standards

The development team consists of **3 concurrent contributors** and **1 lead instructor/reviewer**.

### Team Members & Reviewers
* **Primary Contributors**: Karim Emad Eldin (@TheDev20) Youmna Yasser (@Dev-queen) Farah Essam (@Farahelbehiry)
* **Instructor / Reviewer**: **AlyZakaria** ([GitHub Profile](https://github.com/AlyZakaria))
  * **Email**: `ali.zakariya1929@outlook.com`
  * **Mandatory Rule**: **No code merges into `main` without instructor review and approval**.

### Branching Model
```text
main (Production Release - Protected)
  └── develop (Integration Branch - Default)
        ├── dev/authentication
        ├── dev/course-catalog
        ├── dev/course-details
        ├── dev/programs
        ├── dev/career-paths
        ├── dev/enrollment
        ├── dev/payment
        ├── dev/learner-dashboard
        ├── dev/attendance
        ├── dev/assignments
        ├── dev/instructor-dashboard
        ├── dev/admin-dashboard
        └── dev/cms
```

* **Branch Naming**: `dev/<feature-name>` (or `fix/<bug-name>`).
* **One Feature = One Branch**: Each branch must be focused and independently reviewable.
* **End-to-End Vertical Slices**: Features should connect all layers:  
  `React → ASP.NET Core API → Business Logic → EF Core → SQL Server`
* **Commit Conventions**: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.

---

## 4. Environments, Databases & Cloud Infrastructure

### Environment Matrix
| Environment | Branch | Database | Connection String Target | Deployment Action |
| :--- | :--- | :--- | :--- | :--- |
| **Local Dev** | `dev/*` | `(localdb)\mssqllocaldb` | Local machine `dotnet user-secrets` | Local testing & verification |
| **Development** | `develop` | `DevALMSdb` (Azure SQL) | GitHub Secret (`development` env) | Automated via `deploy-dev.yml` |
| **Production** | `main` | `andalusia-lms-db` (Azure SQL)| GitHub Secret (`production` env) | Manual approval via `deploy-prod.yml` |

### Database Strategy for 3 Contributors
> [!IMPORTANT]
> **All 3 developers use `(localdb)\mssqllocaldb` for day-to-day coding on feature branches**.
> No developer runs migrations directly against `DevALMSdb` from their laptop. When a feature PR is reviewed and merged into `develop`, the CI/CD pipeline applies the migration to `DevALMSdb`. This prevents schema corruption and out-of-order migration conflicts.

### Cloud Resources Reference
* **Azure SQL Server**: `tcp:lmsacademy.database.windows.net,1433`
  * **Admin User**: `ALMS`
  * **Admin Password**: `@LMs123412345`
* **Azure App Service**: `AndalusiaAcademyLMS`
  * **Live URL**: `https://andalusiaacademylms-ffegckcff9clxhkc2.westeurope-01.azurewebsites.net`
* **Discord Integration**: Webhook attached to GitHub repository for commit and pipeline status alerts.

---

## 5. Repository Directory Layout

The repository contains 102 structured directories tracked via `.gitkeep`:

```text
andalusia-academy-LMS/
├── .github/workflows/               # ci.yml, deploy-dev.yml, deploy-prod.yml
├── docs/                            # Architecture specifications, diagrams & release notes
│   └── architecture/                # Phase 1 Implementation Plan & Standards PDFs
├── scripts/                         # dev-setup, database runners, certs, maintenance
├── frontend/                        # React 19 + TypeScript (Vite structure)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/ (common, forms, layout, ui)
│       ├── hooks/
│       ├── pages/ (public, auth, enrollment, learner, instructor, manager, admin, cms)
│       ├── services/
│       ├── types/
│       └── utils/
├── AndalusiaAcademy.API/            # ASP.NET Core 10 Web API
│   ├── Controllers/ (7 modules + CMS)
│   ├── Data/ (Configurations per module, Seed data)
│   ├── DTOs/
│   ├── ENUMs/
│   ├── Exceptions/
│   ├── Mapping/
│   ├── Middleware/
│   ├── Migrations/
│   ├── Models/ (7 modules)
│   ├── Repositories/ (Interfaces, Implementations)
│   ├── Services/ (Interfaces, Implementations - NO AI)
│   └── Validator/
├── AndalusiaAcademy.Worker/         # Background Worker (Outbox, Notifications, Expiry)
├── AndalusiaAcademy.Tests/          # Unit & Integration tests (Zero AI)
├── deploy/                          # Production hosting manifests and SQL bundles
├── DEV_LOG.md                       # Comprehensive step-by-step development history
└── .gitignore                       # Standard .NET & React exclusions
```

---

