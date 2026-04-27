# Booking Fields

Monorepo for a sports field booking platform with:

- a NestJS backend API (`/backend`)
- a React + Vite frontend (`/frontend`)

Users can discover nearby fields (Google Places), view details, create bookings, leave comments, and manage their profile/bookings.

## Main Features

- User registration/login with JWT-based auth and role-aware access (`user`/`admin`)
- Field discovery and details powered by Google Places
- Booking flow with overlap protection and price-change validation
- User comments for fields with ownership/role-based delete rules
- Scheduled backend synchronization of field data from Google APIs
- Frontend map view, filters by city, and protected profile page

## Tech Stack

### Frontend

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios + Fetch for API calls
- Jest (service tests)

### Backend

- NestJS 11 + TypeScript
- TypeORM
- PostgreSQL (`pg`)
- JWT + Passport + bcrypt
- Axios via `@nestjs/axios`
- Nest Scheduler (cron)
- Jest + Supertest

### External Services

- Google Places APIs (nearby search, details)
- Google Geocoding / Places Photo proxy endpoints

## Architecture Overview

- `frontend` is a SPA that calls backend REST endpoints for auth, fields, bookings, comments, and geocoding/photo helpers.
- `backend` is a modular NestJS app with domains: `auth`, `users`, `fields`, `bookings`, `comments`, `google`, `scheduler`.
- `backend` persists local data (users/bookings/comments/local field metadata) in PostgreSQL while enriching field data via Google APIs.
- The scheduler triggers periodic field synchronization.

## Service Interaction

1. Frontend calls backend REST APIs.
2. Backend validates auth/roles and runs business logic.
3. Backend reads/writes PostgreSQL through TypeORM entities.
4. Backend calls Google APIs for place data, photos, and reverse geocoding.
5. Frontend renders combined data (Google + local metadata/comments/bookings).

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or compatible)
- Google API keys with Places/Geocoding access

## Setup (Step-by-Step)

1. Clone repository.
2. Install backend dependencies:
   - `cd backend`
   - `npm install`
3. Install frontend dependencies:
   - `cd ../frontend`
   - `npm install`
4. Configure environment variables (see below).
5. Start PostgreSQL and create the target database.
6. Run backend migrations:
   - `cd ../backend`
   - `npm run migration:run`
7. Start backend and frontend.

## Environment Variables

### Backend (`/backend`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | no | API port. Set to `5000` to match current frontend API base URL. Default in code: `3000`. |
| `DATABASE_HOST` | yes | PostgreSQL host |
| `DATABASE_PORT` | no | PostgreSQL port (default `5432`) |
| `DATABASE_USERNAME` | yes | PostgreSQL user |
| `DATABASE_PASSWORD` | yes | PostgreSQL password |
| `DATABASE_NAME` | yes | PostgreSQL database name |
| `NODE_ENV` | no | If `production`, TypeORM `synchronize` is disabled |
| `JWT_SECRET` | yes | JWT signing/verification secret |
| `JWT_EXPIRATION_TIME` | yes | JWT token expiration (for example `1d`) |
| `GOOGLE_API_KEY` | yes | Google API key for Places/Geocoding |
| `GOOGLE_URL` | yes | Base URL for nearby search requests |
| `GOOGLE_URL_DETAILS` | yes | Base URL for place details requests |
| `DEFAULT_CITY` | no | Fallback city for field search (for example `Kyiv`) |
| `DEFAULT_RADIUS` | no | Fallback radius for field search |
| `DEFAULT_TYPE` | no | Fallback Google Places type (for example `stadium`) |

### Frontend (`/frontend`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_GOOGLE_API_KEY` | yes | Google Maps key used by the map component |

Notes:

- Frontend API base URL is currently hardcoded to `http://localhost:5000` in service files.
- For local development, either run backend on port `5000` or update frontend service constants.

## Run Locally

### 1) Start backend

```bash
cd backend
npm run start:dev
```

### 2) Start frontend

```bash
cd frontend
npm run dev
```

Frontend default dev URL is Vite's local server (commonly `http://localhost:5173`).

## Scripts and Commands

### Backend Scripts (`/backend`)

- `npm run start` - start Nest app
- `npm run start:dev` - start in watch mode
- `npm run start:prod` - run compiled app from `dist`
- `npm run build` - build backend
- `npm run lint` - run ESLint (with `--fix`)
- `npm run test` / `test:watch` / `test:cov`
- `npm run migration:generate` - generate TypeORM migration
- `npm run migration:run` - run TypeORM migrations
- `npm run seed` - run seed script

### Frontend Scripts (`/frontend`)

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and create production build
- `npm run preview` - preview build locally
- `npm run lint` - run ESLint
- `npm test` / `npm run test:watch` - run Jest tests

## Folder Structure

```text
booking-fields/
├─ backend/
│  ├─ src/
│  │  ├─ auth/ bookings/ comments/ fields/ google/ scheduler/ users/
│  │  ├─ database/ (typeorm config + migrations)
│  │  ├─ entities/
│  │  ├─ dto/
│  │  └─ app.module.ts
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ pages/ components/ services/ context/ routes/ tests/
│  │  └─ App.tsx
│  └─ package.json
└─ README.md
```

## Contributing

- Create a feature branch from your main development branch.
- Keep changes scoped and include tests for business logic when possible.
- Run lint/tests before opening a PR:
  - backend: `npm run lint && npm run test`
  - frontend: `npm run lint && npm test`
- Document any new environment variables or API changes in the relevant README.
