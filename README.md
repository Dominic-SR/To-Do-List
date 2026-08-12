# To-Do List (Offline-first React App)

A small offline-capable To-Do list built with React, Vite and Dexie (IndexedDB). It demonstrates basic CRUD operations (create, read, update, delete) with a local IndexedDB store, plus a simple test suite using Vitest and Testing Library.

## Features

- Add tasks with title and optional description
- Edit tasks inline (title + description)
- Toggle complete / undo
- Delete tasks
- Offline storage using IndexedDB via `dexie`

## Tech Stack

- React 19
- Vite
- Dexie + dexie-react-hooks (IndexedDB)
- Tailwind (dev dependency present)
- Vitest + @testing-library/react for tests

## Prerequisites

- Node.js 18+ and npm

## Installation

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd To-Do-List
npm install
```

## Available Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint
- `npm test` — Run Vitest tests once
- `npm run test:watch` — Run Vitest in watch mode

Example:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Local Database (IndexedDB)

This app uses `dexie` with the database instance exported from `src/utils/database/db.jsx` to persist tasks locally in the browser. No server or remote database is required — data stays in the user's browser.

If you need to clear stored tasks manually, open your browser DevTools → Application → IndexedDB → `TodoListDB` and delete the `tasks` store.

## Testing

Tests are written with Vitest and Testing Library. We added unit/integration-style tests for the `Dashboard` component at `src/pages/Dashboard.test.jsx` covering add, edit, toggle, and delete flows.

Run tests:

```bash
npm install
npm test
```

Note: If `vitest` is not found, ensure devDependencies were installed and your PATH/Node environment is configured correctly.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a new branch for your feature/fix
3. Run `npm install` and `npm run dev` locally
4. Add tests where appropriate and run `npm test`
5. Open a pull request with a clear description

## File Overview

- `src/pages/Dashboard.jsx` — Main UI and IndexedDB interactions
- `src/utils/database/db.jsx` — Dexie database schema and export
- `src/pages/Dashboard.test.jsx` — Vitest tests for dashboard flows

## License

This project is provided under the MIT License; see the `LICENSE` file.

---

If you'd like, I can also add badges, usage screenshots, or a short CONTRIBUTING.md. Want any of those added now?
