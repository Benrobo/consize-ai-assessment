# **ConsizeAI Assessment**

This is an assessment focused on scraping jobs from various platforms. The default source is `indeed.com`, but the system is built to support adding more sources in the future.

---

## 🧱 Architecture Overview

This project uses a **monorepo microservices architecture** powered by **Turborepo** and **Yarn Workspaces**.

### Why this setup?

- **Isolation**: Each service is independent and scalable.
- **Resilience**: If one service goes down, others remain unaffected.
- **Scalability**: New sources or features can be added with minimal disruption.
- **Developer Experience**: Shared utilities, environment consistency, and simplified workflows.

---

## 📁 Directory Structure

```txt
packages/
  └── database/       # Prisma schema + DB config
  └── shared/         # Shared utilities and types

services/
  └── gateway/        # API gateway
  └── jobs/           # Admin-only job management and job profile routes
  └── scraper/        # Web scraping service
  └── workers/        # Background jobs + cron job scheduling
```

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js 16+
- Yarn (v4+)
- PostgreSQL running locally or remotely

---

### 1. **Clone the repo**

```bash
git clone https://github.com/benrobo/consize-ai-assessment.git
cd consize-ai-assessment
```

---

### 2. **Install dependencies**

At the project root:

```bash
yarn install
```

---

### 3. **Set up your `.env` files**

Each service and package has its own `.env` file. Use the `.env.example` files as reference:

#### `packages/database/.env`

```env
DATABASE_URL="postgres://postgres:12345@localhost:5432/consizeai-job-scraping"
```

#### `services/jobs/.env`

```env
X_CONSIZE_API_KEY="consize-admin"
TRIGGER_SECRET_KEY="xxxxx" # your trigger.dev secret key
```

#### `services/scraper/.env`

```env
DATABASE_URL="postgres://postgres:12345@localhost:5432/consizeai-job-scraping"

SCRAPERDO_API_KEY="xxxxxx" # scraper.do api key

# GEMINI API KEY
GEMINI_API_KEYS="xxxx::xxxxx::xxxx::xxxx"
```

#### `services/workers/.env`

```env
DATABASE_URL="postgres://postgres:12345@localhost:5432/consizeai-job-scraping"
```

---

### 4. **Trigger.dev Setup**

Trigger.dev requires setting the `projectId` in `trigger.config.ts`.

> `services/jobs/trigger.config.ts`

```ts
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_zvugwlssbiucbnhiwxoo", // <-- make sure this is correct
  runtime: "node",
  logLevel: "log",
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/jobs/**/**", "./src/jobs"],
});
```

---

### 5. **Apply Prisma Migrations**

```bash
cd packages/database
yarn prisma migrate dev --name init
```

---

### 6. **Run All Services (Turbo)**

Back at the root of the repo:

```bash
yarn dev
```

This uses Turborepo to run all services concurrently using their respective `dev` scripts.

Alternatively, to run each service individually:

- `cd services/gateway && yarn dev`
- `cd services/jobs && yarn dev`
- `cd services/scraper && yarn dev`
- `cd services/workers && yarn dev`

---

## ⏲️ Cron & Background Jobs

- All background jobs (e.g. scraping, retrying, cleanups) are handled in `services/workers`.
- Cron jobs are registered there and tied into Trigger.dev when needed.

---

## 🧠 System Highlights

- **Shared Database**: All services connect to the same Postgres DB, managed via Prisma.
- **Retry & Error Escalation**: Failures are logged in a dedicated model (`ScrapingError`) and retried with exponential backoff.
- **Scraper Flexibility**: Designed to be source-agnostic (e.g., add LinkedIn, RemoteOK, etc.).
- **Trigger.dev**: Used to schedule and track background jobs in `services/jobs`.

---

## 🛠️ Development Notes

- Docker is **not** currently used for services, but can be added later for deployment.
- Each service uses its own `.env` and shares types/utilities from `packages/shared`.
- To avoid re-scraping, metadata like job hashes and page status are tracked.
- A future admin dashboard can use the job statuses, errors, and page progress to visualize scraping health.

---

Let me know if you want help creating a README.md file with this, or if you’d like to add deployment instructions next!
