# Frontend App

React + TypeScript + Vite client for the Booking Fields platform.

The app focuses on field discovery, field details, booking creation, comments, and user profile management.

## Main Features and Pages

- `/` home page with search entry points and featured content
- `/fields` list page with city filter, pagination token flow, and map view
- `/field/:placeId` details page with booking form, comments, and admin field editor
- `/profile` protected user page with booking history/management
- `/login` and `/register` auth flows
- `/about` and `*` fallback page

## Architecture

### Routing

- `react-router-dom` with a centralized route table in `src/App.tsx`
- Protected routes are implemented via `PrivateRoute` for authenticated-only pages

### State Management

- Global auth state via React Context (`src/context/AuthContext.tsx`)
- Local component/page state via React hooks (`useState`, `useEffect`)
- Storage:
  - `localStorage` for JWT token
  - `sessionStorage` for selected city/date/time flow data

### API Integration

- Domain services in `src/services`:
  - `authService`
  - `fieldService`
  - `bookingService`
  - `commentService`
  - `googleService`
- Auth uses `fetch`; other domains use `axios`
- Bearer token is attached for protected actions

### Realtime Behavior

- No WebSocket integration currently
- Field detail page uses periodic refresh to detect data changes (for example, price updates)

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- `@react-google-maps/api`
- `react-toastify`, `react-datepicker`, `lucide-react`
- Jest + ts-jest for tests

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_GOOGLE_API_KEY` | yes | Google Maps JavaScript API key for map rendering |

Important:

- Backend base URL is currently hardcoded in service files as `http://localhost:5000`.
- Ensure backend runs on port `5000` in local development, or adjust the API URL constants in `src/services`.

## Run Locally

1. Install dependencies:

```bash
npm install
```

1. Set environment variables (at minimum `VITE_GOOGLE_API_KEY`).
1. Start dev server:

```bash
npm run dev
```

## Build and Deploy

### Production build

```bash
npm run build
```

This runs TypeScript project build (`tsc -b`) and Vite production build.

### Preview build locally

```bash
npm run preview
```

### Deployment notes

- Deploy the generated static output from Vite build.
- Ensure runtime backend URL expectations are satisfied (currently `http://localhost:5000` in code unless changed).

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - build for production
- `npm run preview` - preview built app
- `npm run lint` - run ESLint
- `npm test` - run Jest tests
- `npm run test:watch` - run Jest in watch mode
