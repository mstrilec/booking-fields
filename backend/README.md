# Backend API

NestJS API for the Booking Fields platform. The backend handles authentication, field discovery/synchronization, bookings, comments, and Google API proxy endpoints.

## Responsibilities

- Authenticate users and issue JWT tokens
- Authorize access with role-based guards (`user`, `admin`)
- Serve field search/details data (Google + local DB metadata)
- Manage booking lifecycle with overlap and ownership checks
- Manage field comments and permissions
- Run scheduled synchronization for field data

## Architecture

The app is modular and configured in `src/app.module.ts`.

- `auth` - register/login/me, JWT strategy
- `users` - user persistence logic
- `fields` - nearby search, field details, local field metadata updates, sync
- `bookings` - booking CRUD, conflict detection, price validation
- `comments` - comments create/list/delete
- `google` - photo and reverse-geocode proxy endpoints
- `scheduler` - cron-based field synchronization trigger
- `database` - TypeORM/PostgreSQL setup

Core entities:

- `User`
- `Field`
- `Booking`
- `Comment`

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (JWT required)

### Fields

- `GET /fields` (query: `city`, `radius`, `pageToken`)
- `GET /fields/:placeId`
- `POST /fields/create`
- `PATCH /fields/:placeId` (admin)
- `POST /fields/sync` (admin)

### Bookings

- `GET /bookings` (JWT)
- `GET /bookings/:id` (JWT)
- `POST /bookings` (JWT)
- `PATCH /bookings/:id` (JWT)
- `DELETE /bookings/:id` (JWT)

### Comments

- `POST /comments` (JWT)
- `GET /comments/field/:placeId`
- `DELETE /comments/:id` (JWT)

### Google Proxy

- `GET /google/photo/:photoReference?maxwidth=400`
- `GET /google/geocode?lat=...&lng=...`

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | no | API port (default `3000`) |
| `DATABASE_HOST` | yes | PostgreSQL host |
| `DATABASE_PORT` | no | PostgreSQL port (default `5432`) |
| `DATABASE_USERNAME` | yes | PostgreSQL user |
| `DATABASE_PASSWORD` | yes | PostgreSQL password |
| `DATABASE_NAME` | yes | PostgreSQL database name |
| `NODE_ENV` | no | When `production`, TypeORM `synchronize` is disabled |
| `JWT_SECRET` | yes | JWT secret |
| `JWT_EXPIRATION_TIME` | yes | Token TTL |
| `GOOGLE_API_KEY` | yes | Google API key |
| `GOOGLE_URL` | yes | Base URL for nearby search requests |
| `GOOGLE_URL_DETAILS` | yes | Base URL for place details requests |
| `DEFAULT_CITY` | no | Default city for nearby search (fallback: `Kyiv`) |
| `DEFAULT_RADIUS` | no | Default search radius (fallback: `10000`) |
| `DEFAULT_TYPE` | no | Default Google Places type (fallback: `stadium`) |

## Run Locally

1. Install dependencies:

```bash
npm install
```

1. Configure environment variables.
1. Ensure PostgreSQL is running and DB exists.
1. Run migrations:

```bash
npm run migration:run
```

1. Start in development:

```bash
npm run start:dev
```

## Testing

```bash
npm run test
npm run test:watch
npm run test:cov
```

Note: `npm run test:e2e` is configured, but requires `test/jest-e2e.json`.

## Scripts

- `npm run build` - build Nest app
- `npm run start` - start app
- `npm run start:dev` - start in watch mode
- `npm run start:debug` - debug + watch mode
- `npm run start:prod` - run built app
- `npm run lint` - lint and auto-fix
- `npm run test` / `test:watch` / `test:cov` / `test:debug` / `test:e2e`
- `npm run migration:generate` - generate migration
- `npm run migration:run` - apply migrations
- `npm run seed` - run data seeding

## Important Implementation Details

- **Auth and authorization**
  - JWT-based auth using Passport strategy.
  - Role checks are enforced with `RolesGuard` and `@Roles(...)`.

- **Bookings and pricing**
  - New booking creation rejects overlapping active bookings for the same field.
  - Booking creation can reject stale UI price with `PRICE_CHANGED` when `expectedPrice` does not match the current field price.
  - `finalPrice` is persisted from the field's current price at booking time.

- **Field data model**
  - Field records are enriched from Google Places and merged with local metadata (`price`, `additionalInfo`, `phoneNumber`) and comments.

- **Scheduling**
  - A daily cron job (`EVERY_DAY_AT_10AM`) triggers full field synchronization across configured cities.

- **Realtime**
  - No WebSocket gateway is implemented currently; consumers should use polling/refresh where needed.
