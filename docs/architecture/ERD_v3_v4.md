# ERD v3 / v4 — Identity, Admissions, Payments, Learning

Scope: the tables exercised by Sprints 3 and 4. The full 56-table model is in the migrations.
Migration `20261021184047_Sprint3And4IdentityAdmissionsLearning` adds the items marked **(new)**.

```mermaid
erDiagram
    AppUser ||--o{ UserRole : has
    Role ||--o{ UserRole : grants
    Role ||--o{ RolePermission : has
    Permission ||--o{ RolePermission : in
    AppUser ||--o| InstructorProfile : "is instructor"
    AppUser ||--o{ PasswordResetToken : "requests (new)"

    Course ||--o{ Offering : "scheduled as"
    Offering ||--o{ OfferingInstructor : "taught by"
    InstructorProfile ||--o{ OfferingInstructor : teaches

    AppUser ||--o{ Application : submits
    Offering ||--o{ Application : "applied to"
    Application ||--o| SeatReservation : holds
    SeatReservation ||--|{ ReservationItem : contains
    Offering ||--o{ ReservationItem : "seat on"
    Application ||--o| SalesOrder : "checked out as"
    SalesOrder ||--o{ PaymentAttempt : "paid by"
    Application ||--o| Enrollment : "fulfilled as"
    Enrollment ||--|{ LearningEnrollment : "per course"
    Offering ||--o{ LearningEnrollment : "course offering"

    Offering ||--o{ Session : schedules
    Location ||--o{ Session : hosts
    Session ||--o{ Attendance : records
    LearningEnrollment ||--o{ Attendance : "attends"
    Attendance ||--o{ AttendanceCorrection : "audited by"
    Offering ||--o{ Resource : "materials"
    Resource ||--o{ ResourceProgress : "completed in"
    LearningEnrollment ||--o{ ResourceProgress : tracks
    Offering ||--o{ Assignment : sets
    Assignment ||--o{ Submission : receives
    LearningEnrollment ||--o{ Submission : submits

    AppUser {
        uniqueidentifier Id PK
        nvarchar256 Email UK
        nvarchar500 PasswordHash
        bit IsActive "new"
        varchar64 SecurityStamp "new - rotated to revoke tokens"
    }
    PasswordResetToken {
        uniqueidentifier Id PK
        uniqueidentifier UserId FK
        char64 TokenHash UK "SHA-256, raw token never stored"
        datetimeoffset ExpiresAt
        datetimeoffset UsedAt
    }
    Application {
        uniqueidentifier Id PK
        uniqueidentifier LearnerId FK
        uniqueidentifier OfferingId FK
        nvarchar24 Status "UX filtered: one Submitted/Accepted per learner+offering (new)"
        rowversion RowVersion
    }
    SeatReservation {
        uniqueidentifier Id PK
        uniqueidentifier ApplicationId FK,UK
        nvarchar24 Status "Held/Converted/Released"
        datetimeoffset ExpiresAt
    }
    SalesOrder {
        uniqueidentifier Id PK
        uniqueidentifier ApplicationId FK,UK
        decimal AmountDue
        nvarchar24 Status
        rowversion RowVersion "guards concurrent settlement"
    }
    PaymentAttempt {
        uniqueidentifier Id PK
        nvarchar100 IdempotencyKey UK
        nvarchar60 Provider "Simulated"
        nvarchar24 Status
    }
    Enrollment {
        uniqueidentifier Id PK
        uniqueidentifier ApplicationId FK,UK
    }
    Resource {
        uniqueidentifier Id PK
        nvarchar250 Title
        nvarchar1000 Url "new"
        bit Required
    }
```

Seeded reference data (fixed GUIDs, `Data/Seed/IdentitySeedData.cs`): 4 roles, 13 permissions, 18 role-permission grants.
