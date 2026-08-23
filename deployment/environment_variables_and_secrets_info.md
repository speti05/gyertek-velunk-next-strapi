# Deploy — where to store environment variables

A reminder of where each value goes when deploying to production. The `.env`
files are gitignored, so they are NOT committed to the repo — you must place each
value in the correct location by hand.

## Why are there multiple locations?

- **GitHub Secrets / Variables** → only the `NEXT_PUBLIC_*` values. Next.js inlines
  these into the JS bundle at _build time_, and the build runs on the GitHub
  Actions runner (see `.github/workflows/deploy.yml`), so they must be available
  there.
- **Files on the VPS** → all runtime (server-side) secrets. The containers read
  them at runtime on the VPS; GitHub never needs to see them.

## 1. GitHub → Repository → Settings → Secrets and variables → Actions -> Repository secrets

| Value | Tab | Why |
| ----- | --- | --- |

| `VPS_HOST` | Secrets | not used in local development (See FIRST_DEPLOYMENT.md) |
| `VPS_USER` | Secrets | not used in local development (See FIRST_DEPLOYMENT.md) |
| `VPS_SSH_KEY` | Secrets | not used in local development (See FIRST_DEPLOYMENT.md) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Secrets | build-time, referenced as `secrets.` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Variables | build-time, referenced as `vars.` |

> Note:the NEXT values are actually public (they appear in the browser). The
> Secrets vs Variables split here is only a convention, not a security
> requirement.

In local development, these values are read from `client/.env.local` (see `.env.local.example`).

## 2. VPS: `/opt/gyertek-velunk/.env` (the root `.env`)

Used for the `${...}` substitution in `docker-compose.yml`. Template: `.env.example`.

## 3. VPS: `/opt/gyertek-velunk/server/.env.production`

The prod Strapi container's env (`env_file`). Template: `server/.env.production.example`.
Contains the APP_KEYS/JWT secrets, SMTP, Postgres connection, etc.
The `PREVIEW_SECRET` and Postgres values MUST match the ones in the root `.env`.

## Not needed for production

- `client/.env.local` — only for local `yarn dev`.
- `server/.env` — only for local `yarn dev` / `docker-compose.local.yml`.
