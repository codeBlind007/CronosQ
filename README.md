<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg" width="60" alt="CronosQ Logo"/>
  <h1>CronosQ</h1>
  <p><b>A production-ready distributed job scheduling platform</b></p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-18+-green.svg?logo=nodedotjs" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Next.js-14-black.svg?logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/Prisma-ORM-1B222D.svg?logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Redis-BullMQ-DC382D.svg?logo=redis" alt="Redis" />
  </p>

  <p>
    <em>Reliable execution of background jobs (Email, Webhook, Reminders) with support for cron schedules, retries, delayed execution, real-time status updates, and audit logging.</em>
  </p>
</div>

<br />

## ✨ Features

- **🌐 Versatile Job Types:** Built-in support for **Email**, **Webhook**, and **Reminder** tasks.
- **🕒 Advanced Scheduling:** Run jobs immediately or schedule them for the future with delays.
- **🔁 Bulletproof Execution:** Automatic retries with exponential backoff and dead-letter queue (DLQ) handling.
- **📊 Observability:** Comprehensive job execution history, audit logs, and lifecycle tracking.
- **⚡ Real-time Dashboard:** Live updates powered by **Socket.IO** and **Redis Pub/Sub**.
- **🔐 Secure & Typed:** Clerk authentication, Zod payload validation, and end-to-end Type-safe Prisma ORM.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Radix UI, TanStack Query |
| **Backend** | Node.js, Express.js, TypeScript, Zod |
| **Database** | PostgreSQL (Supabase), Prisma ORM |
| **Queue & Cache** | Redis (Upstash), BullMQ |
| **Real-time & Auth** | Socket.IO, Redis Pub/Sub, Clerk |

---

## 🏗️ High-Level Architecture

<details>
<summary><b>View System Architecture (Mermaid)</b></summary>

```mermaid
flowchart LR

    U[User]

    subgraph Frontend["Next.js Frontend"]
        LP[Landing Page]
        DASH[Dashboard]
        JOBS[Jobs]
        NOTIF[Notifications]
        SOCKET[Socket.IO Client]
    end

    subgraph Backend["Express API"]
        AUTH[Clerk Authentication]
        CTRL[REST Controllers]
        SERVICE[Service Layer]
        QUEUE[Queue Service]
    end

    subgraph Database["PostgreSQL"]
        USER[(Users)]
        JOB[(Jobs)]
        EXEC[(Job Executions)]
        NOTI[(Notifications)]
        AUDIT[(Audit Logs)]
    end

    subgraph RedisLayer["Redis"]
        BULL[BullMQ Queues]
        PUBSUB[Pub/Sub]
    end

    subgraph Workers["Background Workers"]
        EMAIL[Email Worker]
        WEBHOOK[Webhook Worker]
        REMINDER[Reminder Worker]
    end

    subgraph External["External Services"]
        RESEND[Resend Email API]
        API[Webhook APIs]
    end

    subgraph Realtime["Realtime Layer"]
        SOCKETSERVER[Socket.IO Server]
    end

    U --> LP
    U --> DASH

    DASH --> CTRL
    JOBS --> CTRL
    NOTIF --> CTRL

    CTRL --> AUTH
    AUTH --> SERVICE

    SERVICE --> JOB
    SERVICE --> USER
    SERVICE --> NOTI
    SERVICE --> AUDIT

    SERVICE --> QUEUE

    QUEUE --> BULL

    BULL --> EMAIL
    BULL --> WEBHOOK
    BULL --> REMINDER

    EMAIL --> RESEND
    WEBHOOK --> API

    EMAIL --> EXEC
    WEBHOOK --> EXEC
    REMINDER --> EXEC

    EMAIL --> JOB
    WEBHOOK --> JOB
    REMINDER --> JOB

    REMINDER --> NOTI

    EMAIL --> PUBSUB
    WEBHOOK --> PUBSUB
    REMINDER --> PUBSUB

    PUBSUB --> SOCKETSERVER

    SOCKETSERVER --> SOCKET

    SOCKET --> DASH
    SOCKET --> JOBS
    SOCKET --> NOTIF
```

</details>

<details>
<summary><b>View Job Processing Pipeline (Mermaid)</b></summary>

```mermaid
sequenceDiagram
    actor User
    participant FE as Next.js Frontend
    participant API as Express API
    participant DB as PostgreSQL
    participant Q as BullMQ Queue
    participant W as Worker
    participant EXT as External Service
    participant PS as Redis Pub/Sub
    participant IO as Socket.IO

    User->>FE: Create Job
    FE->>API: POST /jobs
    API->>DB: Save Job
    API->>Q: Add BullMQ Job
    API-->>FE: 201 Created
    Q->>W: Pick Job
    W->>DB: Update Status → RUNNING
    W->>PS: Publish JOB_STARTED
    PS->>IO: Forward Event
    IO-->>FE: Live Update
    W->>EXT: Execute Email / Webhook
    EXT-->>W: Response
    W->>DB: Save Execution
    W->>DB: Update Status
    alt Success
        W->>PS: Publish JOB_COMPLETED
    else Failure
        W->>PS: Publish JOB_FAILED
    end
    PS->>IO: Broadcast Event
    IO-->>FE: Update Dashboard
```

</details>

<details>
<summary><b>View Job Lifecycle (Mermaid)</b></summary>

```mermaid
stateDiagram-v2
    [*] --> CREATED
    CREATED --> QUEUED
    QUEUED --> RUNNING
    RUNNING --> COMPLETED
    RUNNING --> FAILED
    FAILED --> RETRYING
    RETRYING --> RUNNING
    FAILED --> DEAD_LETTER
    COMPLETED --> [*]
    DEAD_LETTER --> [*]
```
</details>

---

## 🚀 Supported Job Types

CronosQ handles multiple background tasks natively, each isolated in its own worker for horizontal scalability.

### 📧 Email
Sends scheduled emails (via Resend or similar providers).
```json
{
  "to": "user@example.com",
  "subject": "Welcome to CronosQ!",
  "body": "Your scheduled email has arrived."
}
```

### 🌐 Webhook
Executes HTTP requests to external APIs with custom methods and headers.
```json
{
  "url": "https://api.example.com/sync",
  "method": "POST",
  "headers": { "Authorization": "Bearer token" },
  "body": { "syncId": 123 }
}
```

### ⏰ Reminder
Creates in-app reminder notifications and optionally dispatches emails.
```json
{
  "title": "Quarterly Planning",
  "message": "Join the planning meeting in 10 minutes",
  "channels": ["EMAIL", "IN_APP"]
}
```

---

## ⚡ Real-time Updates

Workers publish lifecycle events through **Redis Pub/Sub**, which are broadcasted to the frontend via **Socket.IO** for instantaneous UI updates without polling.

**Event Flow:**
`Worker` ➡️ `Redis Pub/Sub` ➡️ `Socket.IO` ➡️ `Frontend`

**Supported Events:**
`JOB_STARTED`, `JOB_COMPLETED`, `JOB_FAILED`, `JOB_RETRYING`, `JOB_COMPLETED_NOTIFICATION`, `JOB_FAILED_NOTIFICATION`

---

## 🔒 Reliability Features

- **BullMQ Strategy:** Native locking, atomic operations, and robust queue management.
- **Exponential Backoff:** Smart retry delays to prevent overwhelming failing services.
- **Dead Letter Handling:** Isolates permanently failing jobs for manual review.
- **Idempotent Execution:** Guaranteed exactly-once execution for critical tasks.
- **Audit Logs:** Immutable records of job creation, modification, and deletion.

---

## 💻 REST APIs

| Resource | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Jobs** | `POST` | `/jobs` | Create a new job (immediate, delayed, or cron) |
| **Jobs** | `GET` | `/jobs` | List and filter jobs |
| **Jobs** | `GET` | `/jobs/:id` | Get job details and execution history |
| **Notifications** | `GET` | `/notifications` | List user notifications |
| **Notifications** | `GET` | `/notifications/:id` | Get specific notification |

---

## ⚙️ Environment Setup

Create a `.env` file in the backend root with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cronosq

# Redis
REDIS_URL=redis://localhost:6379

# Auth (Clerk)
CLERK_SECRET_KEY=sk_test_***
CLERK_PUBLISHABLE_KEY=pk_test_***
JWT_SECRET=your_jwt_secret

# External Services
RESEND_API_KEY=re_***

# Config
FRONTEND_URL=http://localhost:3000
```

---

## 🔮 Future Improvements

- [ ] Cron Jobs & Recurring Schedules
- [ ] Worker Dashboard & Metrics (Prometheus/OpenTelemetry)
- [ ] Docker Compose & Kubernetes Deployment manifests
- [ ] Multi-Worker Horizontal Scaling configurations
- [ ] Job Rate Limiting per tenant/user
- [ ] Global Admin Dashboard

---

<div align="center">
  <p>Built with ❤️ by the CronosQ team. Licensed under <b>MIT</b>.</p>
</div>