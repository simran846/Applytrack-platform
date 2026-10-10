# ApplyTrack — Professional Internship Application Management Platform

[![CI Pipeline](https://img.shields.io/badge/CI-Passing-emerald?style=flat-square&logo=githubactions)](.github/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

> **"Your career journey, organized."**

**ApplyTrack** is a production-grade full-stack SaaS platform designed for computer science students and software engineers to manage internship and full-time hiring pipelines. It replaces messy spreadsheets with structured stage tracking, interactive Kanban workflows, scheduled interview agendas, and real-time recruitment conversion analytics.

---

## Key Features

- **Personalized Workspace**: Secure user authentication with password hashing (bcrypt), HTTP-only cookie sessions, and multi-tenant database isolation.
- **Application Management**:
  - Full CRUD operations supporting status milestones: *Wishlist*, *Applied*, *Online Assessment (OA)*, *Interview*, *Offer*, *Rejected*, *Withdrawn*.
  - Work mode tags (*Remote*, *Hybrid*, *On-site*), priority levels (*Low*, *Medium*, *High*, *Top Choice*), compensation details, and recruiter contact fields.
  - Multi-attribute search, server-side filtering, and pagination.
  - Interactive **Table** and **Kanban Board** view modes.
- **Interview Calendar & Agenda**:
  - Month-by-month calendar and categorized chronological agenda.
  - Support for interview types (*Technical Coding*, *System Design*, *Behavioral*, *Phone Screen*, *Take-Home*).
  - Meeting link integration (Google Meet, Zoom, Webex, Chime) and prep/debrief notes.
- **Real-Time Analytics & Funnel Metrics**:
  - Live calculation of Interview Conversion Rate (`Interviews / (Total - Wishlist)`), Offer Rate, and Interview-to-Offer efficiency.
  - 6-month application submission velocity chart (Recharts).
  - Work mode and status distribution visual breakdowns.
- **Data Export**:
  - 1-click export of complete personal history in formatted **CSV** or raw **JSON** format.
- **Interactive OpenAPI Documentation**:
  - Live Swagger UI accessible at `/api/docs`.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS with custom SaaS tokens and subtle glassmorphism
- **Icons & UI**: Lucide Icons, accessible modals, toast notifications, skeleton loaders
- **Charts**: Recharts (Area, Donut, and Bar charts)
- **Forms & Validation**: React Hook Form with Zod schemas

### Backend
- **Runtime**: Node.js & Express.js with TypeScript
- **Architecture**: 3-Tier Layered Architecture (Controllers -> Services -> Repositories)
- **Validation**: Zod schema validation middleware for body, query, and params
- **Database & ORM**: MySQL 8.0 with Prisma ORM (foreign keys, cascade deletes, composite indexes)
- **Security & Headers**: Helmet, CORS with credentials, cookie-parser, express-rate-limit
- **Async Queue**: Redis & BullMQ for reminder jobs (with local fallback)
- **Testing**: Jest and Supertest with dedicated test database isolation

---

## Architecture & Relational Schema

For complete architectural diagrams, Mermaid workflows, and entity relationship diagrams, refer to [ARCHITECTURE.md](ARCHITECTURE.md).

```
   [Next.js 15 Client] ──(HTTP/Cookies)──> [Express Security Middleware]
                                                    │
                                           [Controllers & Services]
                                                    │
                                           [Prisma ORM Layer]
                                           ┌────────┴────────┐
                                    [MySQL 8.0]        [Redis / BullMQ]
```

---

## Quickstart & Local Setup

### Prerequisites
- **Node.js**: v20+
- **MySQL Server**: 8.0+ running on `localhost:3306` (or Docker)

### 1. Clone & Configure Environment

```bash
# Clone the repository
git clone https://github.com/your-username/applytrack.git
cd applytrack
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables (refer to .env.example)
# DATABASE_URL="mysql://root:password@localhost:3306/applytrack"

# Push Prisma schema to MySQL
npm run prisma:push

# Seed database with realistic demo portfolio data
npm run prisma:seed

# Start development server (Port 5000)
npm run dev
```

The backend server will start at `http://localhost:5000`.
- Swagger API Docs: `http://localhost:5000/api/docs`
- Health Check: `http://localhost:5000/health`

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Demo Credentials

The database seed script automatically configures an evaluator demo account:

| Attribute | Value |
|---|---|
| **Email** | `demo@applytrack.dev` |
| **Password** | `Password123!` |
| **Role** | Software Development Engineer (SWE) Intern |
| **Sample Data** | 8 Applications (Google, Stripe, Amazon, Microsoft, etc.) + Scheduled Interviews |

*(Tip: Click the **"Auto-fill"** button on the Login page to fill credentials instantly).*

---

## Running Backend Tests

The backend test suite verifies authentication, duplicate email prevention, cross-tenant data isolation, validation failures, application CRUD, and analytics conversion calculations:

```bash
cd backend
npm test
```

Test results output:
```
PASS tests/applications.test.ts
PASS tests/interviews.test.ts
PASS tests/auth.test.ts

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
```

---

## Docker & Compose Deployment

To run the entire multi-container stack (Frontend, Backend, MySQL, Redis) with a single command:

```bash
# Build and run all services
docker compose up --build -d

# Check running containers
docker compose ps

# Stop containers
docker compose down
```

Services exposed:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MySQL: `localhost:3306`
- Redis: `localhost:6379`

---

## Example REST API Requests

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@university.edu",
    "password": "Password123!",
    "targetRole": "Software Engineer Intern"
  }'
```

### 2. Create Application
```bash
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "companyName": "Palantir",
    "jobTitle": "Forward Deployed Engineer Intern",
    "workMode": "HYBRID",
    "priority": "HIGH",
    "status": "APPLIED",
    "salaryOrStipend": "$60/hr",
    "location": "New York, NY"
  }'
```

### 3. Get Overview Analytics
```bash
curl -X GET http://localhost:5000/api/v1/analytics/overview \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## AWS Deployment Architecture Guide

For production deployment on AWS:

1. **Database Layer**:
   - Deploy **Amazon RDS for MySQL** (Multi-AZ in private subnets).
2. **Compute & API**:
   - Backend Express container deployed on **AWS App Runner** or **Amazon ECS (Fargate)**.
   - Frontend Next.js container deployed on **AWS App Runner** or **AWS Amplify Hosting**.
3. **Caching & Asynchronous Jobs**:
   - **Amazon ElastiCache for Redis** for BullMQ scheduled reminders.
4. **Secrets & Security**:
   - Store `DATABASE_URL` and `JWT_SECRET` in **AWS Secrets Manager** or **SSM Parameter Store**.
   - Front with **Amazon CloudFront** + **AWS WAF** for DDoS and rate limiting protection.

---

## License

MIT License. Designed and engineered for Software Development Engineer (SDE) portfolio showcase.
