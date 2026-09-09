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
| `NEXT_PUBLIC_STRAPI_URL` | Variables | build-time, referenced as `vars.` — set it to `https://admin.gyertekvelunk.eu` |
| `NEXT_PUBLIC_SITE_URL` | Variables | build-time, referenced as `vars.` — set it to `https://gyertekvelunk.eu` |

`NEXT_PUBLIC_STRAPI_URL` is the **public** Strapi origin. It is used for media
URLs and for the CSP `frame-ancestors` header, so it must be a host the browser
can reach — not the internal `http://strapi:1337`, which only exists inside the
Docker network. Server-side API calls keep using `STRAPI_API_URL` (set in
`docker-compose.yml`) and stay on that internal network.

Getting this wrong shows up as broken images: client components fall back to
`http://localhost:1337`, and Next's image optimizer then refuses the fetch with
`upstream image ... resolved to private ip`. Because the value is inlined at
build time, fixing it requires re-running the deploy workflow — restarting the
container is not enough.

> Note:the NEXT values are actually public (they appear in the browser). The
> Secrets vs Variables split here is only a convention, not a security
> requirement.

In local development, these values are read from `client/.env.local` (see `.env.local.example`).

`NEXT_PUBLIC_SITE_URL` is the public URL of the site itself (`https://gyertekvelunk.eu`),
used for absolute URLs — the metadata base in `client/src/app/layout.tsx`, canonical and
Open Graph links. `client/src/utils/get-site-url.ts` **throws** when it is missing rather
than falling back, so leaving it unset fails the client build on the runner instead of
baking `localhost:3000` into every page's metadata. The Strapi side calls the same value
`CLIENT_URL` (section 3).

## 2. VPS: `/opt/gyertek-velunk/.env` (the root `.env`)

Used for the `${...}` substitution in `docker-compose.yml`. Template: `.env.example`.

## 3. VPS: `/opt/gyertek-velunk/server/.env.production`

The prod Strapi container's env (`env_file`). Template: `server/.env.production.example`.
Contains the APP_KEYS/JWT secrets, SMTP, Postgres connection, etc.
The `PREVIEW_SECRET` and Postgres values MUST match the ones in the root `.env`.

Two URLs in this file must be the **public** origins, not the internal Docker
hostnames — Strapi puts them into e-mails and redirects, which run in the
visitor's browser:

| Value | Set it to | Used by |
| ----- | --------- | ------- |
| `STRAPI_URL` | `https://admin.gyertekvelunk.eu` | `server.url` in `config/server.ts` — the e-mail confirmation link — and the newsletter unsubscribe links |
| `CLIENT_URL` | `https://gyertekvelunk.eu` | the post-confirmation and password-reset redirects (`src/index.ts`), the links and footers of outgoing e-mails (`src/lib/config/client-url.ts`), the admin Preview origin (`config/admin.ts`), and the CSP `frame-src` (`config/middlewares.ts`) |

If `STRAPI_URL` is missing, Strapi falls back to `host` + `port` and mails out
`http://0.0.0.0:1337/...` confirmation links. `CLIENT_URL` is **mandatory**: Strapi
throws on boot when it is unset (`throwErrorIfClientUrlMissing` in `src/index.ts`), so
add it to `server/.env.production` *before* deploying, or the container will not start.

`CLIENT_URL` replaced the former `SITE_URL`, which held the same value — if an older
`.env.production` still has a `SITE_URL` line, delete it, nothing reads it any more.

## Not needed for production

- `client/.env.local` — only for local `yarn dev`.
- `server/.env` — only for local `yarn dev` / `docker-compose.local.yml`.
