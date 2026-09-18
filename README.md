# Phase 1 Capstone — TypeScript SPA

A fully typed TypeScript Single Page Application (SPA) created as the final capstone for Phase 1.

The project started as a JavaScript SPA and was incrementally migrated to TypeScript using strict type checking, typed components, typed state management, typed routing, typed tests, and TypeScript-specific tooling.

## What It Does

The application is a **Recipe Browser SPA**.

Users can:

* Browse recipes
* View recipe details
* Navigate between pages using client-side routing
* Manage application state
* Change application settings such as the theme
* Interact with reusable UI components

The application demonstrates how TypeScript can be applied to a real frontend application rather than being used only for isolated examples.

## Live Demo

A live deployment at : https://christojose-vonnue.github.io/Phase-1-Capstone/

## Tech Stack

* TypeScript 5.9
* Vitest
* jsdom
* Vite
* ESLint
* typescript-eslint
* HTML
* CSS
* JavaScript/TypeScript DOM APIs

## TypeScript Features Demonstrated

The project uses TypeScript throughout the application and demonstrates:

* Strict type checking
* Interfaces and object types
* Type aliases
* Union types
* Discriminated unions
* Generic types
* `Record<K, V>`
* `import type`
* Type narrowing
* Type guards
* Nullable and optional values
* Typed function parameters and return values
* Typed DOM APIs
* Typed state management
* Typed routing
* Typed middleware
* Generic API clients
* Type-safe tests
* Path aliases

## Project Structure

```text
Phase-1-Capstone/
│
├── SPA/
│   ├── components/
│   │   ├── component.ts
│   │   └── page.ts
│   │
│   ├── tests/
│   │   ├── component.test.ts
│   │   ├── page.test.ts
│   │   ├── reducer.test.ts
│   │   ├── router.test.ts
│   │   └── store.test.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   └── storage.ts
│   │
│   ├── index.html
│   ├── index.ts
│   ├── reducer.ts
│   ├── router.ts
│   ├── store.ts
│   └── style.css
│
├── t6_Queue.ts
├── t6_queue.test.ts
├── t6_apiClient.ts
├── t6_apiClient.test.ts
├── t6_statemanager.ts
├── t6_statemanager.test.ts
│
├── MIGRATION_LOG.md
├── TS_Day4_Journal.md
├── eslint.config.mjs
├── vite.config.ts
├── tsconfig.json
├── package.json
└── package-lock.json
```

## Application Architecture

The SPA is organized into several responsibilities:

### Components

`SPA/components/`

Contains reusable UI components and page-rendering functions.

`component.ts` contains reusable components such as:

* Button
* Card
* Modal
* Navbar

`page.ts` contains page-level rendering functions such as:

* Home page
* List page
* Detail page
* Settings page

### State Management

`reducer.ts` defines the application's state and actions.

The reducer uses a discriminated union for actions so that TypeScript can determine which payload belongs to each action type.

`store.ts` provides the application store and typed middleware structure.

### Routing

`router.ts` implements client-side routing.

It includes typed route parameters, route matching, route components, and router state.

### Utilities

`utils/constants.ts`

Contains shared application constants and action types.

`utils/storage.ts`

Provides typed local-storage functionality.

### Tests

`SPA/tests/`

Contains TypeScript tests for:

* Components
* Pages
* Reducer
* Router
* Store

The project uses Vitest rather than Jest for the test runner.

## TypeScript Configuration

The project uses:

```json
{
  "target": "ES2022",
  "module": "ES2022",
  "moduleResolution": "bundler",
  "strict": true,
  "noEmit": true,
  "declaration": true
}
```

Strict mode is enabled to make TypeScript actively check the application for type errors.

Path aliases are also configured:

```text
@utils/*
@components/*
```

The same aliases are configured in `vite.config.ts` so that both TypeScript and Vitest/Vite can resolve them.

## Running the Project

Install dependencies:

```bash
npm install
```

Run TypeScript type checking:

```bash
npm run type-check
```

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run ESLint:

```bash
npx eslint .
```

## Verification

The final cleanup verification produced:

* TypeScript: 0 errors
* ESLint: 0 errors
* Tests: 73/73 passed
* Statement coverage: 96.58%
* Branch coverage: 82.05%
* Function coverage: 92.30%
* Line coverage: 97.82%
* Explicit `any` usage in SPA source: none
* Debug `console.log` statements: removed

## Migration Documentation

The JavaScript-to-TypeScript migration process and encountered migration issues are documented in:

```text
MIGRATION_LOG.md
```

The Day 4 development record is documented in:

```text
TS_Day4_Journal.md
```

## Development Philosophy

The project follows an incremental migration approach:

```text
JavaScript
    ↓
TypeScript conversion
    ↓
Type definitions
    ↓
Strict type checking
    ↓
Typed tests
    ↓
ESLint cleanup
    ↓
Coverage verification
    ↓
Final TypeScript capstone
```

The objective was not simply to convert file extensions from `.js` to `.ts`, but to introduce meaningful type safety across application boundaries such as components, state, routing, storage, APIs, and tests.
