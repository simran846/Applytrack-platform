# ApplyTrack — System Architecture & Database Design

This document details the high-level architecture, relational database entity relationships, security isolation model, and data flow of **ApplyTrack**.

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Frontend Layer (Next.js 15 App Router)"]
        UI["React 19 Components + Tailwind CSS"]
        AuthCtx["Auth Context + Session Provider"]
        AxiosClient["Typed Axios API Client"]
    end

    subgraph Security["Security & Middleware Layer"]
        Helmet["Helmet Security Headers"]
        Cors["Strict Origin CORS"]
        RateLimit["Express Rate Limiters"]
        AuthMid["JWT & HTTP-Only Cookie Middleware"]
        ValMid["Zod Request Validation"]
    end

    subgraph Backend["Express.js REST API Layer"]
        Controllers["Controllers (Auth, Applications, Interviews, Analytics, Users)"]
        Services["Business Logic Services"]
        Repositories["Data Access Repositories"]
    end

    subgraph Persistence["Storage & Async Processing"]
        Prisma["Prisma ORM (Connection Pool)"]
        MySQL[("MySQL 8.0 Database (Normalized)")]
        Redis[("Redis 7 (BullMQ Job Queue)")]
        Worker["Background Notification Worker"]
    end

    UI --> AuthCtx
    AuthCtx --> AxiosClient
    AxiosClient -- "HTTPS / JSON / Cookies" --> Security
    Security --> Controllers
    Controllers --> Services
    Services --> Repositories
    Services -. "Enqueues reminders" .-> Redis
    Redis --> Worker
    Repositories --> Prisma
    Prisma --> MySQL
```

---

## 2. Database Entity Relationship (ER) Diagram

```mermaid
erDiagram
    User ||--o{ Application : "owns"
    User ||--o{ Interview : "schedules"
    User ||--o{ Reminder : "configures"
    User ||--o{ ActivityLog : "generates"
    Application ||--o{ Interview : "contains"
    Application ||--o{ Reminder : "triggers"
    Application ||--o{ ActivityLog : "logs"

    User {
        string id PK "UUID"
        string email UK "Unique lowercase"
        string passwordHash "Argon2/bcrypt"
        string name "User full name"
        string avatarUrl "Profile image"
        string targetRole "e.g. SDE Intern"
        text bio "Focus areas"
        datetime createdAt
        datetime updatedAt
    }

    Application {
        string id PK "UUID"
        string userId FK "Indexed owner"
        string companyName "Indexed"
        string jobTitle "Target role"
        text jobDescription "Parsed posting text"
        string companyWebsite "URL"
        string jobPostingUrl "URL"
        datetime applicationDate "Indexed"
        datetime applicationDeadline "Indexed"
        string location "Remote/City"
        enum workMode "REMOTE | HYBRID | ONSITE"
        string employmentType "Internship/Full-time"
        string salaryOrStipend "e.g. $55/hr"
        enum status "WISHLIST | APPLIED | OA | INTERVIEW | OFFER | REJECTED | WITHDRAWN"
        enum priority "LOW | MEDIUM | HIGH | TOP_CHOICE"
        string recruiterName "Optional"
        string recruiterEmail "Optional"
        text notes "Interview strategy"
        datetime createdAt "Indexed"
        datetime updatedAt
    }

    Interview {
        string id PK "UUID"
        string userId FK "Indexed owner"
        string applicationId FK "Cascading foreign key"
        datetime interviewDate "Indexed"
        enum interviewType "PHONE_SCREEN | TECHNICAL | SYSTEM_DESIGN | BEHAVIORAL | HR | FINAL_ROUND"
        string interviewRound "e.g. Round 1"
        string meetingLink "Video URL"
        string location "Meeting platform"
        text preparationNotes "Key algorithms & stories"
        text feedback "Debrief notes"
        enum status "SCHEDULED | COMPLETED | CANCELLED | RESCHEDULED"
        datetime createdAt
        datetime updatedAt
    }

    Reminder {
        string id PK "UUID"
        string userId FK "Owner"
        string applicationId FK "Nullable"
        string title "Reminder headline"
        text description "Details"
        datetime remindAt "Indexed trigger time"
        boolean isCompleted "State"
        enum type "APPLICATION_DEADLINE | INTERVIEW_PREP | FOLLOW_UP | GENERAL"
        datetime createdAt
        datetime updatedAt
    }

    ActivityLog {
        string id PK "UUID"
        string userId FK "Indexed"
        string applicationId FK "Indexed nullable"
        string actionType "APPLICATION_CREATED | STATUS_UPDATED | INTERVIEW_SCHEDULED | DELETED"
        text description "Human readable audit entry"
        json metadata "Old vs new states"
        datetime createdAt "Indexed"
    }
```

---

## 3. Security & Multi-Tenant Data Isolation

1. **Server-Side Authorization**:
   - The user ID is **never** accepted from request bodies or URL parameters for access control.
   - The authenticated identity is extracted exclusively from the verified JWT payload (`req.user.id`).
2. **Compound Query Predicates**:
   - Every database query in the repository layer explicitly enforces `where: { id, userId }`.
   - Attempts to read, edit, or delete another user's records fail with a `404 Not Found` to prevent data leakage.
3. **Password Security**:
   - Passwords are salted and hashed using `bcrypt` (10 rounds). Plaintext passwords are never logged or stored.
4. **Cookie & Session Hygiene**:
   - The authentication token is sent with `httpOnly: true`, `sameSite: 'lax'`, and `secure: true` in production to mitigate XSS and CSRF vectors.
5. **Centralized Error Handling**:
   - Database internals and raw SQL errors are caught centrally and sanitized before sending responses to the client.

---

## 4. Background Job & Queue Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as User / Frontend
    participant API as Express API
    participant DB as MySQL (Prisma)
    participant Redis as Redis BullMQ
    participant Worker as Background Worker

    Candidate->>API: POST /api/v1/applications (with applicationDeadline)
    API->>DB: INSERT into applications
    API->>DB: INSERT into activity_logs
    API->>Redis: Enqueue 'sendReminder' (delayed by deadline - 24h)
    API-->>Candidate: 201 Created (Application details)

    Note over Redis,Worker: Delay countdown expires 24 hours before deadline
    Redis->>Worker: Dispatch Job (userId, applicationId, title)
    Worker->>DB: Record Notification / Trigger in-app banner
```
