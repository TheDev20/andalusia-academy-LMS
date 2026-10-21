# Sprint 3 & 4 API Reference

> Interactive docs: Swagger UI at `/swagger` (Development). Machine-readable contract: `/swagger/v1/swagger.json`.
> All errors are RFC 7807 problem details. Model-validation failures return `400` with field-level `errors`.

## Conventions

| Status | Meaning |
| :--- | :--- |
| `400` | Request failed validation (field errors in `errors`). |
| `401` | Missing, invalid, expired or **revoked** token (logout, password change/reset, deactivation, role change). |
| `403` | Authenticated but lacking the permission, or not assigned/enrolled for the resource. |
| `404` | Resource does not exist **or belongs to someone else** (no ownership leakage). |
| `409` | Concurrency/uniqueness conflict (duplicate application, offering full, seat hold expired, order already paid). |
| `422` | Business rule violation (e.g. offering not open, score above maximum). |
| `429` | Auth endpoints rate limit exceeded (per client IP, `RateLimiting:Auth`). |
| `503` | Payment simulation disabled in this environment. |

Authenticate with `Authorization: Bearer <accessToken>`. Tokens embed `role` and `perm` claims; every request also
re-validates the user's **security stamp**, so revocation is immediate.

## Permission matrix

Source of truth: `ENUMs/RolePermissionMatrix.cs` (seeded into `Role`, `Permission`, `RolePermission`).

| Permission | Learner | Instructor | Admin | ContentManager |
| :--- | :---: | :---: | :---: | :---: |
| `applications.apply` | ✅ | | | |
| `payments.pay-own` | ✅ | | | |
| `learning.access` | ✅ | | | |
| `assignments.submit` | ✅ | | | |
| `cohorts.view-assigned` | | ✅ (assigned only) | ✅ (all) | |
| `attendance.record` | | ✅ (assigned only) | ✅ (all) | |
| `assignments.manage` | | ✅ (assigned only) | ✅ (all) | |
| `submissions.grade` | | ✅ (assigned only) | ✅ (all) | |
| `users.manage` | | | ✅ | |
| `courses.manage` | | | ✅ | ✅ |
| `schedules.manage` | | | ✅ | |
| `payments.manage` | | | ✅ | |
| `content.manage` | | | | ✅ (CMS — Final Sprint) |

## Identity — `api/auth`, `api/me`

| Method | Route | Auth | Notes |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | anonymous | Creates a **Learner**; returns `AuthResponse` (201). |
| POST | `/api/auth/login` | anonymous | `AuthResponse`. Same 401 for unknown e-mail and wrong password. |
| POST | `/api/auth/logout` | any | Revokes all of the caller's tokens (204). |
| POST | `/api/auth/forgot-password` | anonymous | Always 202. Queues `Identity.PasswordResetRequested` in the outbox. `developmentResetToken` is only returned when `Identity:ExposeResetTokenInResponse=true` (Development). |
| POST | `/api/auth/reset-password` | anonymous | `{ email, token, newPassword }`; single-use, 30 min TTL, revokes sessions (204). |
| GET/PUT | `/api/me/profile` | any | Learner profile management. |
| POST | `/api/me/change-password` | any | Requires current password; returns a fresh `AuthResponse`. |

## Catalog (public)

| Method | Route | Notes |
| :--- | :--- | :--- |
| GET | `/api/catalog/courses?searchTerm=&categoryId=&pageNumber=&pageSize=` | Published courses (paged, cached). |
| GET | `/api/catalog/courses/{idOrSlug}` | Course details with offerings and parent programs. |
| GET | `/api/catalog/courses/{slug}/offerings` | Open offerings with live `seatsRemaining` (not cached); the `id` feeds the Apply action. |
| GET | `/api/catalog/programs`, `/api/catalog/programs/{idOrSlug}` | Programs and their included courses / cohorts. |
| GET | `/api/catalog/career-paths`, `/api/catalog/career-paths/{idOrSlug}` | Career paths with recommended programs and courses. |
| GET | `/api/catalog/disciplines` | Tech disciplines for the homepage. `POST` / `PUT /{id}` require `courses.manage`. |

Catalog reads are cached for 5 minutes; admin course/offering writes evict the cache immediately.

## Apply → Pay → Enroll

| Method | Route | Permission | Notes |
| :--- | :--- | :--- | :--- |
| POST | `/api/applications` | `applications.apply` | `{ offeringId }` → `Submitted` and holds a seat for `Admissions:SeatHoldMinutes` (30). |
| GET | `/api/applications/mine` | `applications.apply` | My Applications (status, seat hold, order, enrollment). |
| GET | `/api/applications/{id}` | `applications.apply` | Own applications only. |
| POST | `/api/applications/{id}/cancel` | `applications.apply` | Only while `Submitted`; releases the seat. |
| POST | `/api/payments/orders` | `payments.pay-own` | `{ applicationId }` → sales order (idempotent per application). |
| POST | `/api/payments/orders/{id}/simulate` | `payments.pay-own` | Header `Idempotency-Key` (8–100 chars) **required**. Body `{ "outcome": "Succeeded" \| "Failed" }`. Success settles the order, accepts the application, converts the seat and creates the enrollment in one transaction. Replays return the original result. |
| GET | `/api/payments/mine` | `payments.pay-own` | My Payments (orders + attempts). |
| GET | `/api/enrollments/mine` | `learning.access` | Enrollments with their course-level learning enrollments. |

### State machines (ADR 003)

```
Application:  Submitted ──pay──▶ Accepted
                 │  └─cancel──▶ Cancelled
                 └─hold lapses─▶ Expired
SeatReservation: Held ──▶ Converted | Released
SalesOrder:      PendingPayment ──▶ Paid | Cancelled
PaymentAttempt:  Initiated ──▶ Succeeded | Failed
Enrollment / LearningEnrollment: Active
```

Overselling is prevented by an `UPDLOCK` on the offering row while counting `Held` (unexpired) + `Converted`
reservations (ADR 004). A filtered unique index allows one live (`Submitted`/`Accepted`) application per learner per offering.

## Learner LMS — `api/learning` (`learning.access`)

| Method | Route | Notes |
| :--- | :--- | :--- |
| GET | `/api/learning/courses` | My Courses with next session and progress. |
| GET | `/api/learning/courses/{courseOfferingId}` | Course learning page: instructors, sessions + locations + my attendance, resources + completion, assignments + latest submission, progress. 403 if not actively enrolled. |
| POST | `/api/learning/resources/{resourceId}/complete` | Idempotent. |
| POST | `/api/learning/assignments/{assignmentId}/submissions` | `assignments.submit`; `{ body }`; each call is a new attempt; only `Published` assignments. |

**Progress** = mean of the applicable components: required resources completed, sessions attended
(`Present`/`Late`) out of sessions already started and not cancelled, and published assignments submitted.

## Instructor — `api/instructor`

Requires `cohorts.view-assigned`; the caller must be assigned to the offering (`OfferingInstructor`) unless Admin.

| Method | Route | Extra permission |
| :--- | :--- | :--- |
| GET | `/api/instructor/cohorts` | |
| GET | `/api/instructor/cohorts/{offeringId}` | — sessions, assignments, roster |
| GET | `/api/instructor/cohorts/{offeringId}/progress` | — per-learner progress |
| GET / PUT | `/api/instructor/sessions/{sessionId}/attendance` | `attendance.record`. PUT `{ records: [{ learningEnrollmentId, status, correctionReason? }] }`; status ∈ Present/Absent/Late/Excused; changes are audited in `AttendanceCorrection`; only after the session starts. |
| POST | `/api/instructor/cohorts/{offeringId}/assignments` | `assignments.manage` |
| PUT | `/api/instructor/assignments/{assignmentId}` | `assignments.manage` |
| GET | `/api/instructor/assignments/{assignmentId}/submissions` | `submissions.grade` |
| POST | `/api/instructor/submissions/{submissionId}/grade` | `submissions.grade`; `{ score }` ≤ `maxScore` |

## Admin / Manager — `api/admin`

| Area | Routes | Permission |
| :--- | :--- | :--- |
| Students & instructors | `GET /users?role=&search=&pageNumber=&pageSize=`, `GET /users/{id}`, `POST /users/instructors`, `PUT /users/{id}/status`, `PUT /users/{id}/roles` | `users.manage` |
| Courses | `GET/POST /courses`, `GET/PUT/DELETE /courses/{id}` (delete only if never scheduled — archive otherwise) | `courses.manage` |
| Offerings (schedule) | `GET/POST /offerings`, `GET/PUT /offerings/{id}`, `POST /offerings/{id}/instructors`, `DELETE /offerings/{id}/instructors/{instructorId}` | `schedules.manage` |
| Materials | `GET/POST /offerings/{id}/resources`, `PUT/DELETE /offerings/resources/{resourceId}` | `schedules.manage` |
| Locations & sessions | `GET/POST /locations`, `PUT /locations/{id}`, `GET/POST /offerings/{id}/sessions`, `PUT/DELETE /sessions/{id}` | `schedules.manage` |
| Payments | `GET /payments/orders?status=&search=` | `payments.manage` |

Safeguards: capacity cannot drop below taken seats; sessions with attendance and resources with completions
cannot be deleted; admins cannot deactivate themselves or drop their own Admin role; role changes and
deactivation revoke the user's tokens.

## Configuration

| Key | Default | Notes |
| :--- | :--- | :--- |
| `Jwt:SigningKey` | — | **Required**, ≥ 32 bytes. user-secrets locally; App Service setting `Jwt__SigningKey` in Azure. Startup fails without it. |
| `Jwt:AccessTokenMinutes` | 60 | |
| `Payments:SimulationEnabled` | `false` (`true` in Development) | No real gateway exists in Phase 1. |
| `Identity:ExposeResetTokenInResponse` | `false` (`true` in Development) | Demo aid until e-mail delivery ships. Never enable in production. |
| `Admissions:SeatHoldMinutes` | 30 | |
| `RateLimiting:Auth:PermitLimit` / `WindowSeconds` | 10 / 60 | |
| `Seed:DemoData:Enabled` / `Password` | `false` (`true` in Development) / — | Demo users `admin@`, `instructor@`, `learner@`, `content@demo.andalusia.local`. |
