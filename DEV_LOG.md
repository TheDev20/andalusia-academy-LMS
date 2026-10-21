# Andalusia Academy LMS - Development Log

Welcome to the development log for the **Andalusia Academy LMS** project. This document tracks key milestones, architectural decisions, implementation steps, and operational changes throughout the lifecycle of the project.

---

## Log Summary Table

| Step | Date | Milestone / Objective | Status | Lead / Author |
| :--- | :--- | :--- | :--- | :--- |
| **01** | 2026-09-20 | Project Inception: Repo Creation, Environments & 3-Contributor CI/CD | Completed | @TheDev20 |
| **02** | 2026-09-20 | Directory Structure Establishment (Zero Files, Zero AI, 102 Dirs) | Completed | @TheDev20 |
| **03** | 2026-09-20 | Architecture Specifications & Project Context Integration | Completed | @TheDev20 |
| **04** | 2026-09-27 | Complete 56-Table Domain Model & Initial EF Core Migration | Completed | @TheDev20 |
| **05** | 2026-09-29 | Catalog Query Optimization with Tiered In-Memory Caching & Covering Indexes | Completed | @TheDev20 |
| **06** | 2026-10-21 | Sprint 3 & 4 Backend: Identity, Applications, Payments, Enrollment, Learner LMS, Instructor & Admin APIs | Completed (Pending PR Review) | @TheDev20 |
| **07** | 2026-10-21 | Full-Stack Integration: Full-Stack-Academy UI merged, Sprint 1–4 frontend completed | Completed (Pending PR Review) | @TheDev20 |

---

## [Step 01] - Project Inception, Environment Architecture & Multi-Contributor CI/CD Setup

* **Date**: September 20, 2026
* **Objective**: Establish a clean repository on GitHub, configure isolated `development` and `production` environments, and build GitHub Actions workflows tailored for 3 concurrent contributors without adding application source code yet.
* **Status**: Completed
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)

### 1. Context & Architectural Baseline
Based on the **Andalusia Academy Phase 1 Implementation Plan**:
* **Backend Baseline**: Modular monolith using ASP.NET Core 10, EF Core 10 code-first migrations, Microsoft SQL Server, and an independent background worker.
* **Frontend Baseline**: React with TypeScript, prerendered public catalog and client-rendered authenticated LMS dashboards.
* **Team Structure**: 3 active contributors collaborating simultaneously.

### 2. Key Decisions & Rationale
1. **Zero Application Source Code at Inception**:
   * *Decision*: Do not commit any application code (C#, SQL, React) in the initial repository setup.
   * *Rationale*: Guarantees that the repository infrastructure, branch protections, and CI/CD pipelines are tested and ready before application development begins.
2. **Dual-Environment Strategy**:
   * *Decision*: Configure two separate GitHub Environments (`development` and `production`).
   * *Rationale*: Isolates testing and staging from production. `development` receives automated continuous deployments upon PR merge, while `production` is gated for release versions.
3. **Branching Model for 3 Contributors**:
   * *Branches*:
     * `main`: Represents production-ready code. Direct pushes disabled.
     * `develop`: Active integration branch and default repository branch.
     * `feat/<contributor>/<topic>`: Isolated feature branches for individual developers.
   * *Rationale*: Prevents code conflicts and ensures all features are vetted via Pull Requests before reaching integration.
4. **Automated Concurrency Management**:
   * *Decision*: Add `concurrency` groups with `cancel-in-progress: true` keyed by branch/PR number.
   * *Rationale*: Prevents queue bottlenecks when all 3 contributors push rapid commits to their feature branches.

### 3. Implementation Steps Taken

#### A. Local Repository Initialization
* Initialized empty Git repository at `C:\Users\karim\.gemini\antigravity\scratch\andalusia-academy-LMS`.
* Established standard `.gitignore` tailored for .NET 10 (bin, obj, user settings) and React / Node (node_modules, build, env files).
* Created base branches: `main` and `develop`.

#### B. Remote GitHub Provisioning
* Created private repository: [`TheDev20/andalusia-academy-LMS`](https://github.com/TheDev20/andalusia-academy-LMS).
* Authenticated GitHub CLI via OAuth device flow and granted the necessary `workflow` permissions for GitHub Actions management.
* Pushed `main` and `develop` to the remote origin.
* Set default branch to `develop`.

#### C. GitHub Environments Provisioned
Using the GitHub REST API (`gh api`), two environments were registered:
* **`development`** (ID: `22329278841`)
* **`production`** (ID: `22329284578`)

#### D. GitHub Action Workflows Created
Three core automated pipelines were authored in `.github/workflows/`:

1. **`ci.yml` (Contributor CI & Validation)**:
   * *Triggers*: Pull Requests targeting `develop` or `main`; pushes to `feat/**`, `fix/**`, `contributor/**`.
   * *Concurrency*: Superseded runs are cancelled automatically.
   * *Jobs*:
     * `backend-validation`: Sets up .NET 10 SDK, validates formatting (`dotnet format`), builds solution, and runs unit tests.
     * `frontend-validation`: Sets up Node.js 22, runs TypeScript typecheck (`tsc --noEmit`), ESLint, and test suite.
2. **`deploy-dev.yml` (Deploy to Development)**:
   * *Triggers*: Push to `develop` (upon merging a contributor PR).
   * *Environment*: Binds to `development`.
   * *Tasks*: Validates database migrations and deploys staging services.
3. **`deploy-prod.yml` (Deploy to Production)**:
   * *Triggers*: Push to `main` or semantic version tags (`v*.*.*`).
   * *Environment*: Binds to `production`.
   * *Tasks*: Applies reviewed EF Core migrations, deploys production API/Worker/Frontend, and executes smoke/liveness checks.

### 4. Verification & Validation
* Verified tracked files: Only `.gitignore` and `.github/workflows/*.yml` are present.
* Verified workflows on GitHub via `gh workflow list`:
  * `Contributor CI & Validation` (ID: `362598125` - Active)
  * `Deploy to Development` (ID: `362598126` - Active)
  * `Deploy to Production` (ID: `362598128` - Active)

### 5. Next Steps
* [ ] Milestone 1: Review and sign off on business rules and entity relationship definitions.
* [ ] Milestone 2: Initialize the ASP.NET Core 10 modular monolith foundation and database migration pipeline.
* [ ] Milestone 2: Initialize React TypeScript frontend application with shared accessible components.

---

## [Step 02] - Directory Structure Establishment for Development & Production (Zero Files, Zero AI)

* **Date**: September 20, 2026
* **Objective**: Create the entire folder skeleton for both Development and Main (Production) environments based on the reference architecture and Andalusia Academy standards, with zero code files and zero AI components.
* **Status**: Completed
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)

### 1. Context & Architectural Requirements
* **Reference Alignment**: Adapted from the reference architecture solution layout (Controllers, Services, Repositories, DTOs, Configurations, Migrations, Frontend feature modules).
* **Strict Constraints Satisfied**:
  * **Folders Only**: 100+ directory paths created with zero source code or placeholder files.
  * **Strict AI Exclusion**: Completely excluded `Services/Ai/`, AI models, AI recommendation services, and AI tests.
  * **Excluded Sample Exams**: `test_sample_exams/` completely removed per project directives.
  * **Environment Differentiation**:
    * **Development**: Includes `AndalusiaAcademy.Tests/` (Unit & Integration tests), `Data/Seed/` (Demo seed data), and `scripts/dev-setup/`.
    * **Main (Production)**: Includes `deploy/production/`, `deploy/database/`, `docs/release-notes/`, and `scripts/maintenance/`.

### 2. Created Directory Blueprint

#### Frontend (`frontend/src/`)
* `components/` (`common/`, `forms/`, `layout/`, `ui/`)
* `pages/` (`public/`, `auth/`, `enrollment/`, `learner/`, `instructor/`, `manager/`, `admin/`, `cms/`)
* `hooks/`, `services/`, `types/`, `utils/`, `assets/`

#### Backend Web API (`AndalusiaAcademy.API/`)
* `Controllers/`, `Data/Configurations/`, `DTOs/`, `Models/`, `Services/Interfaces/`, `Services/Implementations/` mapped across the 7 domain modules:
  * `Identity/`, `Catalog/`, `Admissions/`, `Learning/`, `Payments/`, `Compensation/`, `Operations/`, `CMS/`
* `Common/`, `ENUMs/`, `Exceptions/`, `Mapping/`, `Middleware/`, `Migrations/`, `Validator/`, `wwwroot/`, `Data/Seed/`

#### Background Worker (`AndalusiaAcademy.Worker/`)
* `Jobs/` (`OutboxProcessor/`, `NotificationDelivery/`, `ReservationCleanup/`, `PaymentReconciliation/`)

#### Testing Suite (`AndalusiaAcademy.Tests/`)
* `UnitTests/` (`DomainTransitions/`, `BusinessRules/`, `Validation/`)
* `IntegrationTests/` (`ApiContracts/`, `SqlServerConstraints/`, `EndToEndSlices/`)

#### Production Deployment (`deploy/`)
* `deploy/production/`, `deploy/database/`, `scripts/maintenance/`, `docs/release-notes/`

### 3. Verification & Validation
* Verified total directories created: 102 directories.
* Verified that zero new files were written to the new directories.
* Verified that no `Ai` folders or sample exam folders exist in the workspace.

---

## [Step 03] - Architecture Specifications & Project Context Integration

* **Date**: September 20, 2026
* **Objective**: Incorporate full architectural context, project rules, ADRs, database connection topology, and team review procedures into version control and persistent project documentation.
* **Status**: Completed
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)
* **Linked Conversation**: [`714b8492-7ae5-45c0-87dc-1e4b69f0eeff`](conversation://714b8492-7ae5-45c0-87dc-1e4b69f0eeff)

### 1. Context & Architectural Consolidation
Consolidated foundational specifications provided for Phase 1 MVB:
* **Architecture Document**: `docs/architecture/Andalusia_Academy_Phase_1_Implementation_Plan.pdf` (18-page technical architecture & delivery specification).
* **Code & Review Standards**: `docs/architecture/Project_Standards_Branching_Strategy_Code_Review.pdf` (Coding guidelines, Git branching strategy, and instructor review gate).
* **Project Context Document**: Authored `docs/PROJECT_CONTEXT.md` (and root pointer `PROJECT_CONTEXT.md`) detailing:
  * Modular Monolith design principles and 7 business module boundaries.
  * Strict exclusions (Zero AI, no sample exams).
  * Team workflow for 3 concurrent contributors with feature branches (`dev/*`).
  * Instructor review gate with **AlyZakaria** (`ali.zakariya1929@outlook.com`).
  * Complete database connection string matrix (`DevALMSdb` vs `andalusia-lms-db` vs `(localdb)\mssqllocaldb`).
  * Azure App Service deployment topology (`AndalusiaAcademyLMS`).

### 2. Verification & Remote Sync
* Verified PDF specifications placed in `docs/architecture/`.
* Verified `PROJECT_CONTEXT.md` and `docs/PROJECT_CONTEXT.md` committed and synchronized to `develop` on GitHub.

---

## [Step 04] - Complete 56-Table Domain Model & Initial EF Core Migration

* **Date**: September 27, 2026
* **Objective**: Implement the complete 56-table domain model and entity configurations across all 7 business modules (Admissions, Capacity, Catalog, Compensation, Content, Identity, Learning, Payments, Reliability) and generate the baseline EF Core migration.
* **Status**: Completed
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)

### 1. Domain Coverage
* Implemented entity models and Fluent API configurations for all 7 modules per ADR 001 and ADR 002.
* Established `ApplicationDbContext` with comprehensive model binding and table splitting.
* Generated baseline migration: `20260927141657_InitialCreate`.

---

## [Step 05] - Catalog Query Optimization with Tiered In-Memory Caching & Covering Indexes (Option B)

* **Date**: September 29, 2026
* **Branch**: `dev/icache-memory-query`
* **Objective**: Implement Option B from the Architectural RFC ("Catalog Query Architecture & Caching Strategy") for the Catalog & Discovery module in Sprint 2. Build a high-performance backend query endpoint utilizing SQL Server covering indexes, direct DTO projection, server-side pagination, and application in-memory caching (`IMemoryCache`).
* **Status**: Completed (Pending Pull Request Review)
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)

### 1. Architectural Context & Decision
Following team debate on the Catalog Query RFC comparing dual-database polyglot persistence (SQL + Mongo/Elastic) versus Tiered Caching (SQL + In-Memory + TanStack):
* **Decision**: Adopted **Option B (Tiered Caching & Optimized SQL Queries)**.
* **Rationale**:
  * 99% of educational catalog traffic represents read queries from prospective students, while administrative updates are infrequent (<1%).
  * Eliminates the dual-write dilemma, eventual consistency lag, and background CDC/Outbox pipeline overhead required by polyglot architectures.
  * 100% compliant with ADR 001 (Modular Monolith) with zero additional Azure infrastructure cost ($0 extra).
  * Delivers sub-millisecond responses on in-memory cache hits (~0ms) and low-millisecond queries on SQL cache misses.

### 2. Key Components & Implementation Details

#### A. Database Covering Indexes (Level 4)
Updated EF Core Fluent API configurations in `AndalusiaAcademy.API/Data/Configurations/CatalogConfigurations.cs`:
* **`Course`**: Added composite covering index on `(PublicationStatus, Title)` to serve published course searches ordered by title directly from the B-tree index.
* **`Program`**: Added composite covering index on `(PublicationStatus, Title)`.
* **`Offering`**: Added composite indexes on `(Status, StartsAt)` and `(CourseId, Status, StartsAt)` to optimize active intake price and upcoming start date lookups.
* **`CourseCategory`**: Added index on `CategoryId` to accelerate many-to-many category filtering.
* **Migration**: Generated `20260929123155_AddCatalogCoveringIndexes` and verified migration scripts.

#### B. Read-Optimized DTOs & Contracts
Created lean projection models in `AndalusiaAcademy.API/DTOs/Catalog/` and `Common/`:
* **`CourseSummaryDto`**: Lightweight record returning only UI display fields (`Id`, `Title`, `Slug`, `Description`, `Categories`, `StartingPrice`, `NextOfferingDate`), avoiding entity graph materialization.
* **`CatalogQueryParameters`**: Encapsulates `SearchTerm`, `CategoryId`, `PageNumber` (default 1), and `PageSize` (default 12, max capped at 50).
* **`PagedResult<T>`**: Generic reusable pagination envelope containing items, totals, pagination metadata, and navigation flags.

#### C. Repository Query Optimization (Level 5)
Implemented `ICourseRepository` and `CourseRepository`:
* Applied `.AsNoTracking()` to bypass EF Core change tracking.
* Evaluated keyword search matching across `Title` and `Description`.
* Filtered on `PublicationStatus == "Published"`.
* Executed server-side `.CountAsync()` and paging via `.Skip().Take()`.
* Directly projected into `CourseSummaryDto` in SQL via `.Select()`.

#### D. Application In-Memory Caching Layer (Level 3)
Implemented `ICatalogService` and `CachedCatalogService`:
* Registered `IMemoryCache` in `Program.cs`.
* Implemented deterministic cache key construction: `catalog:courses:q={searchTerm}:cat={categoryId}:p={pageNumber}:s={pageSize}`.
* Enforced 5-minute absolute cache TTL (`TimeSpan.FromMinutes(5)`).
* Cache hits bypass SQL database trips entirely, executing in `< 1ms`.

#### E. Public API Controller Endpoint
Created `CatalogController` (`AndalusiaAcademy.API/Controllers/Catalog/CatalogController.cs`):
* Endpoint: `GET /api/catalog/courses`.
* Produces `application/json` with HTTP 200 `PagedResult<CourseSummaryDto>`.
* Includes comprehensive XML documentation and OpenAPI attributes for team review.

### 3. Verification & Validation
* Built solution with `dotnet build AndalusiaAcademy.API.csproj` -> **0 Warnings, 0 Errors**.
* Verified EF Core migration generation with `dotnet ef migrations add AddCatalogCoveringIndexes`.
* Verified clean code isolation on branch `dev/icache-memory-query`.

---

## [Step 06] - Sprint 3 & 4 Backend: Identity → Application → Payment → Enrollment → LMS Operations

* **Date**: October 21, 2026
* **Objective**: Deliver the backend vertical slices for Sprint 3 (conversion journey) and Sprint 4 (learner LMS, instructor and admin dashboards) with API-level role/permission enforcement.
* **Status**: Completed (Pending Pull Request Review)
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)

### 1. Delivered
* **Identity**: registration, login, logout, forgot/reset password, profile, change password. JWT bearer tokens carry `role` + `perm` claims; a per-user **security stamp** is validated on every request so logout, password reset, deactivation and role changes revoke tokens immediately. Passwords use ASP.NET Core `PasswordHasher` (PBKDF2). Auth endpoints are rate limited per IP.
* **Roles & permissions**: Learner, Instructor, Admin, ContentManager; 13 permission codes registered as authorization policies; matrix in `ENUMs/RolePermissionMatrix.cs`, seeded via migration.
* **Admissions**: apply from an open offering (`GET /api/catalog/courses/{slug}/offerings`), seat hold with `UPDLOCK` capacity check (no overselling), cancel, lazy expiry of lapsed holds, My Applications.
* **Payments**: checkout order, approved **payment simulation** with mandatory `Idempotency-Key`, three-phase flow (record attempt → provider call → atomic settlement), My Payments. Simulation is disabled unless `Payments:SimulationEnabled=true`.
* **Enrollment**: created atomically with a successful payment; one `LearningEnrollment` per course offering (program offerings expand to their scheduled courses).
* **Learner LMS**: My Courses, course learning page (schedule, locations, materials, sessions, assignments, attendance, progress), resource completion, assignment submission.
* **Instructor**: assigned cohorts, roster, attendance recording with audited corrections, assignment authoring, grading, learner progress. Cohort access is resource-checked (assigned instructor or Admin).
* **Admin/Manager**: students/instructors (list, create instructor, activate/deactivate, roles), course CRUD, offerings/schedule, locations, sessions, materials, instructor assignment, payments list.
* **Cross-cutting**: RFC 7807 problem details for all errors (`Middleware/GlobalExceptionHandler.cs`), DataAnnotations validation, OpenAPI document (`/openapi/v1.json` in Development), idempotent Development demo-data seeder.

### 2. Schema (migration `Sprint3And4IdentityAdmissionsLearning`)
* `AppUser.IsActive`, `AppUser.SecurityStamp`, `AppUser.PasswordHash` bounded to 500.
* New `PasswordResetToken` table (SHA-256 hash only, single use, 30-minute TTL).
* Filtered unique index: one `Submitted`/`Accepted` application per learner per offering.
* `Resource.Url` for learning materials.
* Seed rows for `Role`, `Permission`, `RolePermission`.
* Documentation: `docs/architecture/ERD_v3_v4.md`, `docs/api/SPRINT_3_4_API.md`.

### 3. Local setup
```bash
cd AndalusiaAcademy.API
dotnet user-secrets set "Jwt:SigningKey" "<random 32+ byte value>"
dotnet user-secrets set "Seed:DemoData:Password" "<demo password>"   # optional, Development only
dotnet ef database update
dotnet run
```

### 4. Verification
* `AndalusiaAcademy.Tests` (new): 82 tests, unit tests plus integration tests running the real API (`WebApplicationFactory`) against **SQL Server 2022** with migrations applied — all passing.
* Coverage includes the Sprint 3 and Sprint 4 demo scripts end to end, 401/403 matrices per role, ownership isolation, token revocation, reset-token reuse, idempotent replay, concurrent applications against capacity, seat expiry, and validation errors.
* CI (`ci.yml`) now starts a SQL Server container (per-run generated password) and exposes `ANDALUSIA_TEST_SQL_SERVER` to `dotnet test`.
* `dotnet format --verify-no-changes` clean; Release build has no code warnings.

### 5. Known gaps / next steps
* **Frontend**: the React app does not exist yet (Sprints 1–4 UI) — login/register, protected routes, My Applications/Payments, learner/instructor/admin dashboards must be built on these APIs.
* Password-reset e-mail delivery depends on the Worker's NotificationDelivery job (Final Sprint); the outbox message is already written.
* A payment that charges at the provider but fails to settle stays `Initiated` and needs reconciliation (Worker job) once a real gateway is integrated.
* Admin catalog edits appear in the public course list after the 5-minute catalog cache expires.
* Program-offering administration and admin application review are not part of this increment.

---

## [Step 07] - Full-Stack Integration & Sprint 1–4 Frontend Completion

* **Date**: October 21, 2026
* **Objective**: Merge the team's `Full-Stack-Academy` branch (Sprint 1–2 website, catalog programs/career paths) with the Sprint 3–4 backend, and close the remaining Sprint 1–4 gaps end to end.
* **Status**: Completed (Pending Pull Request Review)
* **Author / Contributor**: Karim Emad Eldin (@TheDev20)

### 1. Integration decisions
* Kept from `Full-Stack-Academy`: React website and catalog UI, course/program/career-path/discipline endpoints, repositories, `CatalogDbSeeder`, image-URL and category migrations, Swagger UI, FluentValidation.
* Replaced its overlapping Identity/Admissions/Payments/Enrollments code with the tested Step 06 modules (same `/api/auth`, `/api/applications`, `/api/payments`, `/api/enrollments` surface). Accounts created with the earlier branch's password hash format still sign in (`CompatiblePasswordHasher`) and are upgraded to the ASP.NET Core Identity format on first login.
* Security fixes: removed the JWT signing key committed in `appsettings.json`; tech-discipline writes now require `courses.manage` (were anonymous); CORS origins come from `Cors:AllowedOrigins`; seeding runs only in Development.

### 2. Backend additions
* `CatalogCacheInvalidator`: admin course/offering edits evict cached catalog pages immediately.
* Catalog seeder links program offerings to their course offerings (`ProgramOfferingCourse`) so program enrollments grant course access; the demo cohort reuses a seeded offering and has a session in progress for attendance demos.
* My Courses includes course image and category; a session counts toward attendance progress once it has started.

### 3. Frontend additions
* Typed API layer (`services/api/*`) over one `httpClient`: bearer auth, RFC 7807 errors, session-expiry handling, idempotency keys for payments.
* Auth: role-aware login redirect, server-side logout, forgot/reset password pages, profile with change password.
* Learner: dashboard wired to the new API (withdraw, pay pending orders, failed-payment simulation), course learning page (schedule & locations, attendance, materials completion, assignment submission, progress).
* Catalog: program listing/details with apply, career path listing/details.
* Instructor dashboard: cohorts, attendance recording with audited corrections, assignment authoring, grading, learner progress.
* Admin dashboard (permission-filtered tabs): students, instructors, roles, activation, courses, offerings/sessions/materials/instructor assignment, locations, payments.
* Role-based route guards, role-aware navbar, mobile-safe layouts.

### 4. Verification
* Backend: 92 xUnit tests passing against SQL Server 2022 (adds catalog contracts, cache coherence, discipline authorization, in-progress session attendance, legacy password hashes).
* Frontend: `npm run typecheck`, 13 Vitest tests and `npm run build` passing.
* Browser walkthrough (Playwright against the running API + Vite) of both sprint demo scripts: 19/19 steps passing, including the 403s for unauthorized roles.
* CI now validates the `frontend/` app (it previously looked for `package.json` at the repo root and skipped).

