# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gyertek Velunk** is a Hungarian-language full-stack web application for events, articles, and tours. It is a Yarn-workspaces monorepo with two apps:
- `client/` — Next.js 16 frontend (React 19, App Router)
- `server/` — Strapi 5 CMS backend (SQLite by default)

## Development Commands

All commands use Yarn. Run from the repo root unless noted.

### Setup
```bash
yarn setup          # Install deps + copy .env.example → .env for both apps
```

### Development
```bash
yarn dev            # Start both client (port 3000) and server (port 1337) concurrently
yarn client         # Start only the Next.js dev server
yarn server         # Start only the Strapi dev server
```

### Build
```bash
cd client && yarn build   # Build Next.js for production
cd server && yarn build   # Build Strapi admin panel
```

### Lint
```bash
cd client && yarn lint    # ESLint on src/
```

### Database
```bash
yarn seed           # Import seed data into Strapi (from seed-data.tar.gz)
yarn export         # Export current database as seed data
```

### Docker
```bash
docker-compose -f docker-compose.local.yml up   # Local Docker environment
docker-compose up                                # Production Docker environment
```

## Architecture

### Data Flow
Next.js fetches content from Strapi's REST API. The client uses `qs` for query string building and Zod for response validation. In Docker, the client calls Strapi via the internal Docker network; locally it uses `localhost:1337`.

### Client (`client/src/`)
- **App Router** with route groups. Dynamic `[slug]` handles generic pages; named routes handle `beszamolok` (articles/reports) and `turaink` (tours).
- **Styling stack**: SASS (`sass/`) for base styles + Tailwind CSS v4 for utilities + Material UI v7 for component library. MUI overrides live in `sass/mui-override/`.
- **Path alias**: `@/*` maps to `src/*`; `@clientRoot/*` maps to the client project root.
- **Providers** (`src/components/providers/`) wrap the app with React Context (e.g., reCAPTCHA v3, theme).
- **Blocks** (`src/components/blocks/`) are content-type-driven components that render Strapi block data.

### Server (`server/src/`)
- **Content types** (in `src/api/`): `article`, `event`, `event-signup`, `global`, `home-page`, `newsletter-signup`, `page`.
- **Components** (in `src/components/`): `blocks`, `elements`, `layout` — shared Strapi component schemas used across content types.
- **Database**: SQLite in development (`.tmp/data.db`); configurable for MySQL/PostgreSQL via environment variables.
- **Email**: Nodemailer (Gmail SMTP by default), configured in `server/config/`.
- **Plugins**: `@strapi/plugin-users-permissions`, `@offset-dev/strapi-calendar`.

### Environment Files
- `server/.env` — Strapi secrets (APP_KEYS, JWT secrets, DB config, SMTP). Copy from `server/.env.example`.
- `client/.env.local` — Strapi API URL. Copy from `client/.env.local.example`.
- Root `.env` — reCAPTCHA secret key (used by server-side Next.js routes).

The `copy-env.mts` utility at the root automates copying `.env.example` → `.env` during `yarn setup`.

### Docker
- Both services have multi-stage Dockerfiles based on `node:20-alpine`.
- Client uses Next.js standalone output for minimal image size.
- `docker-compose.yml` (production) uses `.env.production`; `docker-compose.local.yml` uses `.env`.
- Strapi uploads and database are persisted via Docker volumes.
