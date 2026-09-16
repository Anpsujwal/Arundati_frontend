# 🪔 Arundhati Frontend

> **Arundhati Brahmin Alliance Matrimony Platform** — React + Vite single-page application.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Authentication Flow](#authentication-flow)
- [Key Components](#key-components)
- [Scripts](#scripts)

---

## Overview

The Arundhati frontend is a React SPA that provides a polished matrimony browsing and management experience. It connects to the Arundhati REST API backend for all data operations.

**Core capabilities:**
- Public landing page, user registration (multi-step wizard) and login
- Authenticated user dashboard, match browsing, interest management
- Full profile editing (personal, astrological, family, photos, documents)
- Admin panel for reviewing and approving/rejecting profiles

---

## Tech Stack

| Layer          | Technology                                |
|----------------|-------------------------------------------|
| Framework      | React 19 (JSX)                            |
| Build Tool     | Vite 8                                    |
| Language       | JavaScript (JSX) + TypeScript (`counter.ts`, `main.ts`) |
| Routing        | React Router DOM v7                       |
| HTTP Client    | Axios                                     |
| Icons          | Lucide React                              |
| Notifications  | React Hot Toast                           |
| Styling        | Vanilla CSS (custom design system)        |

---

## Project Structure

```
frontend/
├── index.html              # HTML shell
├── vite.config.js          # Vite configuration (proxy to backend)
├── tsconfig.json           # TypeScript config
├── .env                    # Environment variables (git-ignored)
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root component (BrowserRouter + AuthProvider + Toaster)
    ├── style.css           # Global base styles
    ├── styles/
    │   └── index.css       # Design system tokens & component styles
    ├── api/                # Axios instance + per-module API functions
    ├── assets/             # Static images & SVGs
    ├── components/
    │   ├── layout/         # Navbar, Sidebar, header components
    │   ├── profile/        # Profile view/edit sub-components
    │   ├── ui/             # Reusable UI primitives (Button, Card, Badge, etc.)
    │   └── wizard/         # Multi-step registration wizard steps
    ├── contexts/
    │   └── AuthContext.jsx # Global auth state (user, login, logout)
    ├── hooks/              # Custom React hooks
    ├── layouts/
    │   ├── UserLayout.jsx  # Authenticated user shell (nav + outlet)
    │   └── AdminLayout.jsx # Admin shell (nav + outlet)
    ├── pages/
    │   ├── public/         # Landing, Login, Register, RegisterComplete
    │   ├── user/           # Dashboard, Matches, CandidateProfile, Interests, MyProfile
    │   └── admin/          # AdminDashboard, PendingVerification, ProfileReview
    ├── router/
    │   ├── AppRouter.jsx   # Route definitions
    │   └── ProtectedRoute.jsx # Route guards (auth, admin, guest)
    └── utils/              # Shared helper functions
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- Backend server running at `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Run in Development

```bash
npm run dev
# App available at http://localhost:5173
```

Vite is configured to proxy `/api` requests to the backend, so no CORS issues during local development.

### Build for Production

```bash
npm run build
# Output in dist/
```

### Preview Production Build

```bash
npm run preview
```

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

| Variable         | Example                     | Description                    |
|------------------|-----------------------------|--------------------------------|
| `VITE_API_URL`   | `http://localhost:5000`     | Base URL of the backend API    |

> All Vite env variables must be prefixed with `VITE_` to be accessible in the browser.

---

## Pages & Routes

### Public Routes

| Path                | Component          | Description                                       |
|---------------------|--------------------|---------------------------------------------------|
| `/`                 | `Landing`          | Marketing landing page                            |
| `/login`            | `Login`            | Login form (redirects authenticated users away)   |
| `/register`         | `Register`         | Multi-step registration wizard                    |
| `/register/complete`| `RegisterComplete` | Post-registration profile completion (auth required) |

### User Routes (Authentication Required)

Wrapped in `UserLayout` which provides the main navigation shell.

| Path            | Component          | Description                                   |
|-----------------|--------------------|-----------------------------------------------|
| `/dashboard`    | `Dashboard`        | Welcome screen with profile completion status |
| `/matches`      | `Matches`          | Browse opposite-gender approved profiles      |
| `/matches/:id`  | `CandidateProfile` | Detailed view of a specific match             |
| `/interests`    | `Interests`        | Sent & received interest management           |
| `/profile/me`   | `MyProfile`        | View and edit own profile                     |

### Admin Routes (Admin Role Required)

Wrapped in `AdminLayout` which provides the admin navigation shell.

| Path                 | Component             | Description                          |
|----------------------|-----------------------|--------------------------------------|
| `/admin`             | `AdminDashboard`      | Platform statistics & overview       |
| `/admin/pending`     | `PendingVerification` | Queue of profiles awaiting review    |
| `/admin/profile/:id` | `ProfileReview`       | Full profile review with approve/reject actions |

---

## Authentication Flow

Authentication state is managed globally by [`AuthContext`](src/contexts/AuthContext.jsx):

1. **Login**: User submits credentials → API sets an HTTP-only JWT cookie → `AuthContext` stores the user object in memory.
2. **Session Persistence**: On app load, `AuthContext` calls `GET /api/v1/auth/me` using the existing cookie to restore session.
3. **Logout**: Calls `POST /api/v1/auth/logout` → cookie is cleared → user is redirected to `/login`.

### Route Guards

| Guard            | Behaviour                                               |
|------------------|---------------------------------------------------------|
| `ProtectedRoute` | Redirects unauthenticated users to `/login`             |
| `AdminRoute`     | Redirects non-admin users to `/dashboard`               |
| `GuestRoute`     | Redirects already-authenticated users to `/dashboard`   |

> Since auth tokens are stored as HTTP-only cookies, Axios must be configured with `withCredentials: true`.

---

## Key Components

### Layouts

| Component      | Description                                                |
|----------------|------------------------------------------------------------|
| `UserLayout`   | Main shell for authenticated users — navbar + page outlet  |
| `AdminLayout`  | Admin shell — sidebar + page outlet                        |

### UI Primitives (`components/ui/`)

Reusable, styled building blocks used across pages (buttons, cards, badges, form inputs, loaders, modals, etc.).

### Registration Wizard (`components/wizard/`)

Multi-step form that walks a new user through:
1. Basic account details
2. Personal information
3. Astrological details
4. Family background
5. Photo upload

### Profile Components (`components/profile/`)

Modular sub-sections for viewing and editing each part of the user profile (personal, astro, family, photos, documents).

---

## Scripts

| Command           | Description                             |
|-------------------|-----------------------------------------|
| `npm run dev`     | Start Vite dev server with HMR          |
| `npm run build`   | Type-check + production bundle          |
| `npm run preview` | Serve the production build locally      |
