# Director-OS

SUH Director OS frontend — Vite + React + Tailwind.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Authentication runs against the API at `VITE_API_URL`
(`https://director-os-backend.vercel.app`). The backend's CORS allow-list covers
`localhost:5173` and `localhost:4173`, so if Vite falls back to another port,
sign-in is blocked — start it with `npm run dev -- --port 5173` in that case.

## Demo login

- Director: `director@suhtech.top` / `director123` (no OTP)
- Manager: `manager@suhtech.top` / `manager123` · OTP `123456`

Finance is director-only; a manager sees a no-permission state there.

## Where the data comes from

The backend database is currently empty, so the UI reads from a centralized
development dataset instead of rendering blank everywhere.

| Path | Role |
| --- | --- |
| `src/mock/dataset.js` | The single source of realistic, cross-consistent records |
| `src/mock/db.js` | Async CRUD over that dataset, persisted to `localStorage` |
| `src/data/source.js` | The one seam between UI and data |
| `src/data/DataStore.jsx` | React store: `useCollection`, `useRecord`, `useStore` |

No component imports mock data directly — everything goes through the store.

**Switching to the live API** is one environment variable:

```bash
VITE_DATA_SOURCE=api npm run dev
```

`src/data/source.js` already maps reads to `GET /api/bootstrap`. Writes are wired
for the collections the backend currently supports (leads, campaigns, projects,
tasks, tickets); any other collection throws a clear "no endpoint yet" error
rather than failing silently. Add the endpoint, then add it to `API_WRITERS`.

To reset local edits back to the pristine dataset, clear the
`director_os_mock_db` key in `localStorage`.

## Reviewing UI states

Append a query parameter to any page to force a state:

- `?mock=loading` — skeletons
- `?mock=error` — error state with retry
- `?mock=empty` — empty states

## Structure

```
src/
  components/ui/    DataTable, forms, page states, tabs — shared primitives
  components/common Buttons, badges, avatars, modals
  components/layout Sidebar, topbar, shells
  data/             Store and the API/mock seam
  hooks/            useTableState, useForm, useGlobalSearch
  mock/             Development dataset
  pages/<module>/   List / Form / Detail per module
```

Every module follows the same route shape: `/x` list, `/x/new`, `/x/:id` detail,
`/x/:id/edit`.
