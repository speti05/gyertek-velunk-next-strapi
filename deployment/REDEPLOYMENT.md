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

## 5. Rolling back

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
