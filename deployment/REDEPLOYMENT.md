# Redeploying (app already live on the VPS)

Use this once the VPS has already been through
**[FIRST_DEPLOYMENT.md](./FIRST_DEPLOYMENT.md)** — Docker, `docker-compose.yml`,
nginx and TLS certs are already in place, and you just want to ship a new
change (code, env var, or config).

## 1. Standard redeploy (only app code changed)

This covers the common case: you changed something in `client/` or `server/`,
committed it, and neither `docker-compose.yml` nor the nginx configs nor any
env var changed.

```bash
gh workflow run deploy.yml --ref main
gh run watch
```

This is `.github/workflows/deploy.yml`, which automatically:

1. Builds and pushes new `server`/`client` images to GHCR.
2. Backs up Postgres over SSH into `backups/deploy/` on the VPS (keeps the
   last 5 — see `.github/workflows/backup-postgres.yml`).
3. SSHes in and runs `docker compose pull && docker compose up -d`, which
   recreates only the containers whose image actually changed.

Verify:

login to ssh: (e.g. Windows power shell)

```bash
ssh user@VPS_IP
```

```bash
cd /opt/gyertek-velunk
docker compose ps                 # everything Up
docker compose logs -f strapi     # check for schema-sync errors if content-types changed
```

Then check `https://gyertekvelunk.eu` and `https://admin.gyertekvelunk.eu/admin`
in a browser.

## 2. `docker-compose.yml` or nginx config changed

The GitHub Actions workflow only rebuilds images and restarts containers from
whatever `docker-compose.yml` **already exists on the VPS** — it does not
copy the file itself. If you changed `docker-compose.yml` or anything under
`deployment/nginx/`, copy the updated files across first:

Open an other powershell window (not the ssh session) and run:

```bash
cd "C:\path-to-your-local-folder-of-docker-compose"
scp docker-compose.yml user@VPS_IP:/opt/gyertek-velunk/
scp -r deployment/nginx user@VPS_IP:/opt/gyertek-velunk/deployment/
```

Then run the standard redeploy (section 1). If only the nginx config changed
(no new image needed), you can skip the workflow and just reload nginx
directly on the VPS:

```bash
ssh user@VPS_IP
cd /opt/gyertek-velunk
docker compose exec nginx nginx -t   # validate config first
docker compose exec nginx nginx -s reload
```

## 3. Environment variables / secrets changed

Also not handled by the workflow — edit the files directly on the VPS
(see `environment_variables_and_secrets_info.md` for what goes where):

```bash
ssh user@VPS_IP
nano /opt/gyertek-velunk/.env                          # or
nano /opt/gyertek-velunk/server/.env.production
```

Then recreate the affected containers so they pick up the new values:

```bash
cd /opt/gyertek-velunk
docker compose up -d
```

`docker compose up -d` recreates any container whose resolved config
(including `env_file` contents) changed — no manual restart needed. If you
changed a `NEXT_PUBLIC_*` value, that's baked into the client image at
**build** time, not read at runtime — set it in GitHub → Variables/Secrets
and trigger a normal redeploy (section 1) instead of editing anything on the
VPS.

Two values now fail loudly instead of falling back to `localhost`: the client
build breaks without the `NEXT_PUBLIC_SITE_URL` variable, and Strapi refuses to
boot without `CLIENT_URL` in `server/.env.production`. Set both before
redeploying.

## 4. Strapi content-type / schema changes

- **Additive** (new field, new content-type, new component): no extra steps,
  Strapi syncs the schema automatically when the `strapi` container restarts
  as part of the normal redeploy.
- **Destructive** (renamed/removed field, changed type): needs a migration
  file under `server/database/migrations/` committed alongside the schema
  change, or the auto-sync will silently drop the column and lose data. Take
  a manual Postgres backup before deploying this kind of change, on top of
  the automatic pre-deploy backup:
  ```bash
  ssh user@VPS_IP
  cd /opt/gyertek-velunk
  docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > manual_backup_$(date +%Y%m%d).sql
  ```

## 5. Seeding prod content from your local Strapi

Two scripts move articles, blogs and events (with their blocks and media) from
your local Strapi into another environment. They are meant for filling a fresh
or half-empty prod with template/testing content — **not** for a regular
content sync: prod is the source of truth once real editing starts there.

Nothing is ever deleted on the target. Entries are upserted **by slug**, so
event signups, contact requests, newsletter signups and users on the target are
untouched.

### 5.1 Export locally

```bash
cd server
yarn export:content
```

Writes `exports/content-export.json` (articles + blogs + events, published and
draft-only, with every block and media reference).

`server/scripts/export-template-content-for-testing.mjs` boots Strapi in-process
and reads through the Document Service, so it needs **no running server and no
API token**, and it is not filtered by the `hide-disabled-content` middleware —
entries flagged as `disabled` are exported like any other.

### 5.2 Create a full-access API token on the target

In the target Strapi admin: **Settings → API Tokens → Create new API Token**,
token type **Full access**. Copy the value — it is shown only once.

Full access is required for two reasons: the importer uploads media through
`/api/upload`, and the middleware that hides `disabled` entries only lets a
full-access token see them. With a read-only or custom token the importer
cannot tell that a disabled entry already exists, and would create a duplicate
instead of updating it.

### 5.3 Dry run

Always run without `--apply` first. From the **repo root** (the importer reads
media from `server/public/uploads`, so it has to run against your local
checkout):

```bash
node scripts/import-content.mjs --target https://admin.gyertekvelunk.eu --token <full-access token>
```

It prints one `create` / `update` line per entry, how many media files it
resolved on the target, and which ones it would upload. Nothing is written.

Check that the create/update split matches what you expect. `create` for an
entry you know exists on the target means the slug differs, or the token is not
full-access.

### 5.4 Apply

```bash
node scripts/import-content.mjs --target https://admin.gyertekvelunk.eu --token <full-access token> --apply
```

Instead of passing `--token` every time, put the token in `client/.env.local`:

```
STRAPI_IMPORT_TOKEN=<full-access token>
```

`scripts/import-content.mjs` reads that file itself (plain node does not load it,
only Next does). Precedence is `--token` > a real environment variable >
`client/.env.local`.

**This variable is local-only.** It is a credential _for_ a remote Strapi, used
by a script you run from your own machine — nothing in the running site ever
reads it. Do not add it to GitHub Secrets/Variables, to `/opt/gyertek-velunk/.env`
on the VPS, or to `docker-compose.yml`. `client/.env.local` is gitignored, so the
token stays on your machine.

Useful flags:

| Flag            | Default                       | What it does                                                                                       |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `--file`        | `exports/content-export.json` | Which export to import                                                                             |
| `--collections` | `articles,blogs,events`       | Comma-separated subset                                                                             |
| `--uploads`     | `server/public/uploads`       | Where local media is read from                                                                     |
| `--out <dir>`   | _(off)_                       | Dumps the computed payload per entry as JSON, for inspection. Gitignored under `exports/payloads/` |

Media is matched on the target by content hash first, then by file name;
anything still missing is uploaded from the local uploads directory. If a
referenced file is missing locally the script reports it and exits non-zero —
the entry is still written, but that media reference ends up empty.

Afterwards, check the entries in the target admin panel, and remember that
anything exported with `disabled: true` stays hidden on the public site until
you clear the flag (see `TestUser` in section 7).

### 5.5 Running both from VS Code

`.vscode/launch.json` has launch configurations for all three steps, so you do
not have to type the commands. **Run and Debug** panel → pick one → F5:

| Configuration                                                    | Equivalent command                                  |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| `Export template content (local -> exports/content-export.json)` | `cd server && yarn export:content`                  |
| `Import content (DRY RUN)`                                       | `node scripts/import-content.mjs --target <picked>` |
| `Import content (APPLY - writes to the target!)`                 | the same plus `--apply`                             |

Both import configurations prompt for the target first, offering
`http://localhost:1337` and `https://admin.gyertekvelunk.eu`. They deliberately
do **not** ask for the token: it is read from `client/.env.local` (see 5.4), so
it never ends up in a launch argument or in your shell history.

All three run in the integrated terminal, so you see the same output as from the
command line — including the dry-run plan and the media summary.

## 6. Rolling back

Images are only tagged `:latest`, so `docker compose pull` always gets the
newest build — there's no `:previous` tag to fall back to automatically.
To roll back:

- **Code**: re-run the workflow against an older commit:
  ```bash
  gh workflow run deploy.yml --ref <previous-good-commit-sha>
  ```
  This rebuilds and pushes that commit's code as `:latest` again and
  redeploys it.
- **Data**: restore from a pre-deploy backup if the bad deploy also corrupted
  data:
  ```bash
  ssh user@VPS_IP
  cd /opt/gyertek-velunk
  docker compose exec -T postgres psql -U strapi -d strapi < backups/deploy/backup_<timestamp>.sql
  ```
  Restoring into a live database only works cleanly if the target database is
  empty/compatible — for a destructive rollback, drop and recreate the
  database first, or restore into a fresh `postgres-data` volume.

## 7. Disabled entries and the `TestUser` role

Articles, blogs and events have a `disabled` flag. The REST API itself hides
flagged entries — `find` gets an extra filter, `findOne` answers `404` — so they
never reach the public site, regardless of what the front-end asks for. This is
the `hide-disabled-content` middleware, wired into those three routers.

Two callers see them anyway:

- a user in the **`TestUser`** role, for previewing content on the live site
  before enabling it;
- a **full-access API token**, which is what the import tooling in section 5
  uses.

### Giving someone test access

The `TestUser` role is created automatically on Strapi boot, with the
permissions it needs — nothing to click under **Settings → Users & Permissions
→ Roles** after a deploy. A Strapi user has exactly one role, so `TestUser`
replaces `Authenticated` for its members and therefore carries the same
permissions plus read access to the three content types.

To promote someone: **Content Manager → User → pick the user → role →
`TestUser`**, save. They need to sign out and back in on the site so their JWT
is reissued.

The role cannot be assigned through the public API: `role` is stripped from the
body of `register`, `user.create` and `user.update` by the users-permissions
extension. Without that, any logged-in user could `PUT /api/users/:id` and move
themselves into `TestUser`, since the `Authenticated` role holds `user.update`.

### If a test user sees an empty site

The front-end only forwards a user's JWT to Strapi when they are in the
`TestUser` role, so ordinary visitors are unaffected. If Strapi rejects that
token (`401`/`403`), the loader falls back to a public read and logs:

```
[loaders] Strapi rejected the test user's token on /api/articles (403). Grant the
Authenticated role find/findOne on this content type, ...
```

The test user then sees the normal public site rather than a blank page. Check
the client container logs for that line:

```bash
ssh user@VPS_IP
cd /opt/gyertek-velunk
docker compose logs client | grep '\[loaders\]'
```
