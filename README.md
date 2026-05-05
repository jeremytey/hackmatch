# HackPartner

> Hackathon teammate discovery platform for Malaysian university students.  
> Find qualified teammates by role, skills, and availability - before the deadline.

[![CI](https://github.com/jeremytey/hackpartner/actions/workflows/ci.yml/badge.svg)](https://github.com/jeremytey/hackpartner/actions)
[![Live](https://img.shields.io/badge/live-hackpartner.dev-brightgreen)](https://hackpartner.dev)

## Live Demo
**Web:** https://hackpartner.dev  
**API:** https://hackpartner-production.up.railway.app

---

## The Problem

At KitaHack 2026, 50+ students posted in a single Discord channel looking for hackathon teammates: unstructured introduction messages, no filtering by role or skill, no way to know who was still available. Most teams formation was rushed last minute. 

HackPartner gives students structured profiles and a filterable participant feed for each hackathon to find the right teammate in minutes.

---

## Architecture

![Architecture](docs/architecture.png)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js + Express | Non-blocking I/O suits concurrent API requests; lightweight enough for a single-service MVP |
| Language | TypeScript | Catches type errors at compile time across the entire codebase; `z.infer<>` gives one source of truth between Zod schemas and TS types |
| ORM | Prisma | Schema-as-code migrations prevent dev/prod drift (schema.prisma single source); typed queries eliminate a class of runtime errors that raw SQL misses at compile time |
| Database | PostgreSQL | Relational model fits the many-to-many user-skill and user-hackathon relationships; strong constraints enforce data integrity at the DB layer |
| Auth | JWT + refresh token rotation | Stateless access tokens scale horizontally; rotation means a stolen refresh token is invalidated on first reuse — attacker loses access on next rotation cycle |
| Validation | Zod | Runtime validation at the API boundary; ensures bad data never reaches Service layer; `z.infer<>` means one schema drives both runtime checks and TypeScript types |
| Logging | Winston | Structured JSON logs in production are queryable in log aggregators; `console.log` is not |
| Testing | Jest + Supertest | Integration tests hit real Express routes against a real test DB — catches middleware and auth bugs that unit tests miss |
| CI/CD | GitHub Actions | Test gate on every push; auto-deploy on merge to main — no broken code reaches Railway without passing the suite first |
| Frontend | React + TypeScript + Zustand | Component model with typed global auth state; Axios interceptors handle silent token refresh without user facing disruption |
| Deployment | Railway + Render + Vercel | API on Railway, DB on Render, frontend on Vercel — each service on the tier optimised for its workload |

---

## Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL running locally

### Backend
```bash
git clone https://github.com/jeremytey/hackpartner.git
cd hackpartner/backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend
```bash
cd hackpartner/frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

### Environment Variables
See `backend/.env.example` and `frontend/.env.example` for all required keys.

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | public | Create account |
| POST | /auth/login | public | Login, return tokens |
| POST | /auth/refresh | httpOnly cookie | Rotate refresh token, return new access token |
| POST | /auth/logout | httpOnly cookie | Revoke refresh token |
| GET | /users/me | user | Get own profile |
| PUT | /users/me | user | Update own profile + skills |
| GET | /users/:userId | public | Get user profile |
| GET | /skills | public | Get full skill list |
| GET | /hackathons | public | List all hackathons |
| GET | /hackathons/:id | public | Hackathon details |
| GET | /hackathons/:id/participants | user | Filtered participant feed |
| POST | /hackathons/:id/join | user | Register for hackathon |
| PUT | /hackathons/:id/participant | user | Update team status |
| DELETE | /hackathons/:id/leave | user | Leave hackathon |
| POST | /hackathons | admin | Create hackathon |
| PUT | /hackathons/:id | admin | Edit hackathon |
| DELETE | /hackathons/:id | admin | Delete hackathon |

---

## Testing

```bash
cd backend
npm test
```

37 integration tests across 4 suites covering: register, login, refresh token rotation, logout, profile CRUD, hackathon CRUD, join/status/leave, participant feed filtering, and edge cases (duplicate registration, expired deadlines, role-based access control, invalid tokens).

---

## User Feedback Log

| Date | User | University | Feedback | Action Taken |
|------|------|------------|----------|--------------|

---

## Author
Jeremy Tey Jie Ming — Sunway University, BSc Computer Science  
[LinkedIn](https://www.linkedin.com/in/jeremy-tey/)