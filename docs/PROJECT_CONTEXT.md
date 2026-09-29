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

## 6. Sprint Delivery Plan (Phase 1 — MVP)

> **Delivery Philosophy**: Every sprint delivers a **vertical slice** connecting UI, API, database, and business flow. No isolated frontend-only or backend-only phases.

### Sprint Calendar

| Sprint | Deadline | Main Focus | Outcome |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | 24 September 2026 | Foundation + Public Website | Establish the system foundation and deliver a complete, navigable public academy website. |
| **Sprint 2** | 1 October 2026 | Catalog & Discovery | Make Courses, Programs, and Career Paths real, connected, API-driven data. |
| **Sprint 3** | 8 October 2026 | Identity → Application → Payment → Enrollment | Complete the core customer/learner conversion journey. |
| **Sprint 4** | 15 October 2026 | Learning Experience + Instructor + Admin | Turn enrollment into an operational LMS with dashboards and session operations. |
| **Final Sprint** | 22 October 2026 | CMS + Notifications + Integration + Quality | Complete, stabilize, secure, and prepare the production-ready product. |
| **Graduation** | 29 October 2026 | Final Demonstration & Handover | Demonstrate the full end-to-end journey and submit final project artifacts. |

---

### Sprint 1 — Foundation + Public Website
* **Deadline**: 24 September 2026
* **Goal**: Create the foundation of the system and a complete, navigable public academy website.
* **Depends on**: None (Starting baseline).
* **Required Scope**:
  * Project setup: React + TypeScript, ASP.NET Core 10 Web API, EF Core 10, and SQL Server.
  * Git/GitHub repository structure and agreed branching model.
  * Initial database ERD & relational mappings.
  * Initial authentication and role model design.
  * Public navigation and routing.
  * Homepage sections: Hero, Career Path Discovery, Popular Categories, Featured/Trending Courses & Programs, Coming Soon, Corporate/For Business, Partners/Trust, Testimonials, CTAs, Footer.
  * About Us, Contact/Support, and basic public pages.
  * Responsive layout and reusable accessible components.
* **Sprint Demo — Definition of Done**:
  1. Open website.
  2. Navigate between public pages without broken routes.
  3. Show all homepage sections.
  4. Show initial ERD and project architecture.
  5. Demonstrate application running from a clean checkout.
* **Submission Package**:
  * GitHub repository
  * React and ASP.NET Core projects
  * Initial database + migration
  * ERD v1
  * Public website implementation
  * README with setup instructions
  * Sprint demo/presentation

---

### Sprint 2 — Catalog & Discovery
* **Deadline**: 1 October 2026
* **Goal**: Turn the academy catalog into real, API-driven functionality and establish Course → Program → Career Path relationships.
* **Depends on**: Sprint 1 public structure and initial data model.
* **Required Scope**:
  * Course listing and course details.
  * Search, basic filtering, sorting, and pagination / load-more.
  * Course data retrieved from backend API rather than hardcoded React state.
  * Program listing and program details (structure and included courses).
  * Career Path listing and details (recommended skills, related courses and programs).
  * Relationships between Career Paths, Programs, and Courses.
  * Course status/type/category handling.
  * Seed realistic development demo data.
* **Sprint Demo — Definition of Done**:
  1. Open Courses and retrieve data from the API.
  2. Search/filter courses and open a course detail page.
  3. Open a Program and see its included courses.
  4. Open a Career Path and see recommended courses/programs.
  5. Show database relationships and Swagger endpoints.
* **Submission Package**:
  * Courses module, Programs module, Career Paths module
  * Search/filter/sort functionality
  * API endpoints + Swagger UI
  * Database/ERD v2
  * Seed data & Updated README
  * Sprint demo/presentation

---

### Sprint 3 — Identity → Application → Payment → Enrollment
* **Deadline**: 8 October 2026
* **Goal**: Complete the core customer/learner conversion journey: a visitor becomes an enrolled student.
* **Depends on**: Working course/program details from Sprint 2.
* **Required Scope**:
  * User registration and login.
  * Logout, password reset / forgot password flow.
  * Learner profile management.
  * JWT authentication and role-based authorization.
  * Roles: Learner/Student, Instructor, Admin/Manager, Content Manager.
  * Apply/Enroll action from course/program details.
  * Application creation and status tracking.
  * Payment step (gateway or approved simulation).
  * Enrollment creation and status tracking.
  * Protected learner routes.
  * My Applications / My Payments views.
* **Sprint Demo — Definition of Done**:
  1. Register a new learner.
  2. Log in and receive authenticated session/token.
  3. Browse to a course.
  4. Submit an application.
  5. Complete agreed payment simulation/gateway flow.
  6. Show resulting enrollment.
  7. Open learner dashboard and view enrolled course.
  8. Demonstrate that protected routes reject unauthorized roles.
* **Submission Package**:
  * Authentication + authorization modules
  * Registration/login/profile
  * Application, Payment, and Enrollment modules
  * Protected routes/endpoints
  * ERD v3 & API documentation
  * Validation and error handling
  * Sprint demo/presentation

---

### Sprint 4 — Learning Experience + Instructor + Admin
* **Deadline**: 15 October 2026
* **Goal**: Turn enrollment into an operational LMS and provide instructors and managers with tools to run cohorts.
* **Depends on**: Sprint 3 working enrollment flow.
* **Required Scope**:
  * **Learner Dashboard**: My Courses / My Programs, course learning page, schedules, locations, learning materials/resources, sessions, assignments, attendance, and basic progress.
  * **Instructor Dashboard**: View assigned cohorts, sessions, attendance recording, assignments, and learner progress.
  * **Admin/Manager Dashboard**: Basic student, instructor, course, schedule, and payment management.
  * Roles and permissions enforced at API level.
* **Sprint Demo — Definition of Done**:
  1. Log in as a learner and open an enrolled course.
  2. View materials and sessions.
  3. View and submit an assignment.
  4. View attendance and progress tracking.
  5. Switch to instructor account and manage attendance/assignments.
  6. Switch to admin account and manage core operational records.
  7. Attempt unauthorized actions and verify blocking.
* **Submission Package**:
  * Learner LMS, Instructor Dashboard, Admin/Manager Dashboard
  * CRUD for agreed management modules
  * Attendance, Assignments, Progress tracking
  * Permission matrix implementation
  * ERD v4 & Updated API documentation
  * Sprint demo/presentation

---

### Final Sprint — CMS + Notifications + Integration + Quality
* **Deadline**: 22 October 2026
* **Goal**: Finish the product as one unified, tested, and secure system.
* **Depends on**: Sprints 1–4 working together.
* **Required Scope**:
  * **CMS Dashboard**: Manage homepage content, courses, programs, career paths, partners, testimonials, FAQs, and public content.
  * **Notifications**: Outbox-driven notifications for account, application, payment, enrollment, session, and assignment events.
  * Full frontend and backend validation with consistent error handling and user feedback.
  * **Security Review**: Authentication, authorization, password handling, protected endpoints.
  * Integration testing of the full learner journey.
  * Responsive UI and accessibility/usability polish.
  * Bug fixes, performance tuning, and production deployment preparation.
* **Sprint Demo — Definition of Done**:
  1. Content Manager updates public content and website reflects changes immediately.
  2. Run complete end-to-end flow: Visitor → Application → Payment → Enrollment → LMS.
  3. Demonstrate key transactional notifications.
  4. Demonstrate validation, error handling, and role permissions.
  5. Demonstrate deployed application in staging/production.

---

### Graduation — Final Demonstration & Handover
* **Deadline**: 29 October 2026
* **Outcome**: Comprehensive live demonstration of the complete system and submission of final project deliverables and documentation.
