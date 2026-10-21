# Andalusia Academy — web app

React 19 + TypeScript + Vite front end for the Andalusia Academy LMS. See the [root README](../README.md) for
running the API alongside it.

```sh
npm ci
npm run dev          # http://127.0.0.1:5173 (proxies /api; override with VITE_API_PROXY_TARGET)
npm run typecheck
npm test             # Vitest + Testing Library
npm run build
```

## Structure

- `src/pages/public` — website, catalog (courses, programs, career paths), syllabus and apply flow
- `src/pages/auth` — login, sign-up, forgot/reset password
- `src/pages/learner` — learner dashboard (My Learning / Applications / Payments) and course learning page
- `src/pages/instructor` — assigned cohorts: attendance, assignments, grading, progress
- `src/pages/admin` — students, instructors, courses, schedule, locations, payments
- `src/services/api` — typed API clients over a single `httpClient` (bearer auth, problem-details errors, session expiry)
- `src/components/portal` — shared portal UI (tabs, tables, forms, modal, badges)

Route guards in `App.tsx` improve navigation only; the API enforces every role and permission.

## Images

Image assets in `public/images/` were generated with an image tool; prompts are in `IMAGE-PROMPTS.md`.
