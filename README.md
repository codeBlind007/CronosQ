# ⚡ CronosQ — Distributed Job Scheduling Platform

A production-ready distributed job scheduling platform that enables reliable execution of background jobs such as **Email**, **Webhook**, and **Reminder** tasks with support for retries, delayed execution, real-time status updates, execution history, and audit logging.

Built using **Node.js**, **Express**, **TypeScript**, **BullMQ**, **Redis**, **PostgreSQL**, **Prisma**, and **Socket.IO**.

---

## ✨ Features

- 📧 Email Job Scheduling
- 🌐 Webhook Execution
- ⏰ Reminder Jobs
- 🕒 Delayed & Scheduled Jobs
- 🔁 Automatic Retry with Exponential Backoff
- 💀 Dead Letter Handling
- 📜 Job Execution History
- 📊 Job Lifecycle Tracking
- 🔔 Real-time Updates via Socket.IO
- 📡 Redis Pub/Sub Event Streaming
- 🔐 Clerk Authentication
- 📝 Audit Logging
- ✅ Zod Validation
- ⚡ Type-safe Prisma ORM

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)

## Queue

- BullMQ
- Redis (Upstash)

## Authentication

- Clerk

## Real-time

- Socket.IO
- Redis Pub/Sub

## Validation

- Zod

---

## High Level Architecture

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

---
# Job Lifecycle

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

---
# Job Processing Pipeline

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

---

# Project Structure

```
backend/
│
├── src
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── services
│   ├── workers
│   ├── processors
│   ├── queues
│   ├── socket
│   ├── events
│   ├── validators
│   ├── utils
│   ├── prisma
│   └── app.ts
│
└── prisma
    └── schema.prisma
```

---

# Supported Job Types

## Email

Sends scheduled emails.

Payload

```json
{
  "to": "user@example.com",
  "subject": "Welcome",
  "body": "Hello World"
}
```

---

## Webhook

Executes HTTP requests.

Payload

```json
{
  "url": "https://example.com/webhook",
  "method": "POST",
  "headers": {},
  "body": {}
}
```

---

## Reminder

Creates reminder notifications and optionally sends emails.

Payload

```json
{
  "title": "Meeting",
  "message": "Join meeting in 10 minutes",
  "channels": [
    "EMAIL",
    "IN_APP"
  ]
}
```

---

# Worker Architecture

Each job type has an independent worker.

```
Email Queue
    ↓
Email Worker

Webhook Queue
    ↓
Webhook Worker

Reminder Queue
    ↓
Reminder Worker
```

This makes the platform horizontally scalable.

---

# Real-time Updates

Workers publish lifecycle events through Redis Pub/Sub.

```
Worker

↓

Redis Pub/Sub

↓

Socket.IO

↓

Frontend
```

Supported events

- JOB_STARTED
- JOB_COMPLETED
- JOB_FAILED
- JOB_RETRY

---

# REST APIs

## Jobs

| Method | Endpoint |
|----------|----------|
| POST | `/jobs` |
| GET | `/jobs` |
| GET | `/jobs/:id` |

---

## Notifications

| Method | Endpoint |
|----------|----------|
| GET | `/notifications` |
| GET | `/notifications/:id` |

---

# Reliability Features

- BullMQ Retry Strategy
- Exponential Backoff
- Delayed Execution
- Dead Letter Handling
- Persistent Execution History
- Idempotent Job IDs
- Audit Logs
- Worker Isolation

---

# Environment Variables

```
DATABASE_URL=

REDIS_URL=

CLERK_SECRET_KEY=

CLERK_PUBLISHABLE_KEY=

RESEND_API_KEY=

FRONTEND_URL=

JWT_SECRET=
```

---

# Future Improvements

- Cron Jobs
- Recurring Schedules
- Worker Dashboard
- Queue Metrics
- Prometheus Monitoring
- OpenTelemetry Tracing
- Docker Compose
- Kubernetes Deployment
- Multi-Worker Horizontal Scaling
- Rate Limiting
- Admin Dashboard

---


# License

MIT