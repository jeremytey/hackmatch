# HackMatch

> Hackathon teammate discovery platform for Malaysian university students.
> Find qualified teammates by role, skills, and availability - before the deadline.

![CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci.yml/badge.svg)
![Live](https://img.shields.io/badge/live-railway-brightgreen)

## Live Demo
**API:** https://YOUR_RAILWAY_URL  
**Web:** https://YOUR_VERCEL_URL

## The Problem
Malaysian University Students find hackathon teammates via Discord channels, XHS posts, checking out LinkedIn profiles, and cold-messaging strangers. With no way to filter by role, skill level, or whether they're even still looking for teammates. Most teams form on luck, not fit. A seamless matched team is the difference maker in a Hackathon compared to a mismatched team. 

HackMatch offers a platform for students to structure profiles, filter for potential teammates, helping you find the right teammate in minutes.


## Architecture
[INSERT EXCALIDRAW DIAGRAM EXPORT HERE]

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js + Express | Familiar, performant, large ecosystem |
| Language | TypeScript | Type safety, catches type errors at compile time |
| ORM | Prisma | Type-safe queries, clean migrations, great DX |
| Database | PostgreSQL | Relational data, strong constraints, strong consistency|
| Auth | JWT + refresh token rotation | Stateless, secure, industry standard |
| Validation | Zod | Runtime type safety, pairs well with TypeScript |
| Logging | Winston | Structured logs, queryable in production |
| Testing | Jest + Supertest | Integration tests against real routes |
| CI/CD | GitHub Actions | Auto-test on push, auto-deploy on merge |
| Frontend | React + TypeScript + Zustand | Component model, typed state management |
| Deployment | Railway + Render + Vercel | Free tier, zero config, fast deploys |

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Steps
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/hackmatch.git
cd hackmatch/backend
cp .env.example .env
# Fill in .env values
npm install
npm run db:migrate
npm run db:seed
npm run dev
\`\`\`

### Environment Variables
See `.env.example` for all required keys.

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | public | Create account |
| POST | /auth/login | public | Login, return tokens |
| POST | /auth/refresh | user | Renew access token |
| POST | /auth/logout | user | Revoke refresh token |
| GET | /profile/me | user | Get own profile |
| PUT | /profile/me | user | Update own profile |
| GET | /skills | public | Get skill list |
| GET | /hackathons | public | List all hackathons |
| GET | /hackathons/:id | user | Hackathon details |
| GET | /hackathons/:id/participants | user | Participant feed |
| POST | /hackathons/:id/register | user | Join hackathon |
| PUT | /hackathons/:id/status | user | Update team status |
| DELETE | /hackathons/:id/register | user | Leave hackathon |
| POST | /hackathons | admin | Create hackathon |

## Testing
\`\`\`bash
npm test
\`\`\`
Covers: register, login, refresh, logout, profile CRUD, 
hackathon join/status/leave, participant feed filtering.

## User Feedback Log
| Date | User | University | Feedback |
|------|------|-----------|---------|
| - | - | - | Collecting after launch |

## Author
Jeremy Tey Jie Ming — Sunway University, BSc Computer Science  
[LinkedIn] (https://www.linkedin.com/in/jeremy-tey/)