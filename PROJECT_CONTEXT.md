# Andalusia Academy LMS - Project Context

This project context synthesizes all architecture specifications, team standards, cloud environments, and setup decisions

For the complete technical blueprint, ADRs, environment and credential-handling rules, branching workflows, and reviewer protocols, please refer to:

👉 **[docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)**

### Quick Reference
* **Architecture**: Modular Monolith (ASP.NET Core 10 + EF Core 10 + React 19 + SQL Server)
* **Modules**: Identity, Catalog, Admissions, Learning, Payments, Compensation, Operations, CMS
* **Strict Exclusions**: ZERO AI, No `test_sample_exams/`
* **Team**: 3 concurrent contributors | Lead Reviewer: **AlyZakaria** (`ali.zakariya1929@outlook.com`)
* **Review Policy**: No PR merge into `main` without instructor approval
* **Databases**:
  * Local Dev: `(localdb)\mssqllocaldb` (AndalusiaAcademy_Dev)
  * Dev Staging: `DevALMSdb` (`tcp:lmsacademy.database.windows.net,1433`)
  * Production: `andalusia-lms-db` (`tcp:lmsacademy.database.windows.net,1433`)
* **Azure App Service**: `AndalusiaAcademyLMS` (`https://andalusiaacademylms-ffegckcff9clxhkc2.westeurope-01.azurewebsites.net`)
* **Sprint Schedule**:
  * Sprint 1 (24 Sep): Foundation + Public Website
  * Sprint 2 (1 Oct): Catalog & Discovery
  * Sprint 3 (8 Oct): Identity → Application → Payment → Enrollment
  * Sprint 4 (15 Oct): Learning Experience + Instructor + Admin
  * Final Sprint (22 Oct): CMS + Notifications + Integration + Quality
  * Graduation (29 Oct): Final Demonstration & Handover
* **Specifications**: Stored in [`docs/architecture/`](docs/architecture/)
