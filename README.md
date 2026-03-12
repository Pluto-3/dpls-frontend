# DPLS — Digital Permit & License System (Frontend)

React frontend for the Digital Permit & License System. Supports three user roles: Applicant, Officer, and Admin.

**Live App:** https://dpls-frontend.onrender.com

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS v3
- Axios
- React Router v6

---

## Running Locally

**Prerequisites:** Node.js 18+

1. Clone the repo
   ```bash
   git clone https://github.com/Pluto-3/dpls-frontend
   cd dpls-frontend
   ```

2. Copy the example env file and fill in your values
   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_FILES_BASE_URL=http://localhost:8080/api/applications/files
   ```

3. Install dependencies and start
   ```bash
   npm install
   npm run dev
   ```

App will be available at `http://localhost:5173`

---

## Features by Role

**Applicant**
- Create and submit permit applications
- Upload supporting documents
- Track application status and officer notes
- View issued permit with verification code
- Activity timeline per application

**Officer**
- Review submitted applications
- Approve, reject, or request corrections
- Issue permits on approved applications

**Admin**
- View system statistics
- Manage departments and permit types

**Public**
- Verify any issued permit by verification code at `/verify`

---

## Deployment

Deployed as a static site on Render.

**Required environment variables** (set in Render dashboard before building):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL — `https://dpls-backend.onrender.com/api` |
| `VITE_FILES_BASE_URL` | File serving URL — `https://dpls-backend.onrender.com/api/applications/files` |

> Vite bakes env variables in at build time — update these in the Render dashboard and trigger a redeploy for changes to take effect.

To deploy: push to `main` — Render builds and deploys automatically.
