# CivicLens AI

CivicLens AI is an urban intelligence workspace for reporting, triaging, and resolving municipal incidents. It combines a citizen portal with operational views for city command teams, departments, field officers, and infrastructure analysts.

## Features

- Incident reporting with category, location, severity, and citizen details
- Gemini-powered image triage, civic copilot chat, and predictive risk forecasts
- Live incident map, city analytics, command center, department views, and field operations console
- CSV incident import and report export workflows
- Firebase Authentication, Firestore incident sync, and Storage integration

## Technology

React 19, TypeScript, Vite, Tailwind CSS, Express, Firebase Web SDK, Leaflet, Motion, and the Google GenAI SDK.

## Setup

Prerequisites: Node.js 20 or newer and npm.

```bash
npm install
Copy-Item .env.example .env.local
```

Fill in `.env.local` with the values for the environment you are running. `.env.local` is ignored by Git and must never be committed.

### Environment variables

The client Firebase configuration uses `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.

The server uses `GEMINI_API_KEY`, `GEMINI_MODEL` (defaults to `gemini-2.5-flash`), and `PORT` (defaults to `3000`). See `.env.example` for the complete variable list.

## Development

```bash
npm run dev
```

The development server hosts the Vite application and API on `http://localhost:3000`. The `/api/health` endpoint reports server and Gemini configuration status.

## Validation and production build

```bash
npm run lint
npm run build
npm start
```

The build creates the Vite client and bundles the Express server into `dist/server.cjs`. Set `NODE_ENV=production` when running the bundled server.

## Firebase

Configure Firebase Authentication, Firestore, and Storage in the Firebase console, then apply the checked-in `firestore.rules`, `firestore.indexes.json`, and `storage.rules` to the target project. The application requires Firebase configuration and authenticated users.

### Required Firebase custom claims

Authorization is based on Firebase ID-token claims, not local storage or client-selected roles. Set `role` to one of `citizen`, `officer`, `department_head`, or `admin`. Admin tokens must also include `admin: true` for Firestore and Storage administrator access. Department heads must include a `department` claim matching the incident department. Officers must have their Firebase UID in an incident's `assignedOfficerId` field.

## Deployment

### Vercel

Import the repository into Vercel and keep the project root at the repository root. The checked-in `vercel.json` builds the Vite client from `dist` and routes `/api/*` to the Express serverless function in `api/index.ts`.

Add these variables in Vercel Project Settings -> Environment Variables for **Production**, **Preview**, and **Development** as appropriate:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
GEMINI_API_KEY
GEMINI_MODEL
```

The six `VITE_FIREBASE_*` values are required for the login and Firebase client to initialize. `GEMINI_API_KEY` is required for AI analysis, assistant chat, and predictive endpoints. Never commit these values; `.env.local` is only for local development.

After adding or changing Vercel variables, trigger a new deployment. Existing deployments do not receive newly added environment variables automatically.

The Vercel deployment serves the built SPA and exposes the Gemini API routes without placing the Gemini key in browser code. A Node-compatible deployment can still run the bundled `dist/server.cjs` using `npm start`.
