# First deployment to a VPS

Step-by-step guide for taking the current stack (Next.js client + Strapi 5 CMS +
Postgres) from GitHub to a **brand-new** production VPS for the first time,
using Docker images built by GitHub Actions, pushed to GitHub Container
Registry (GHCR), and deployed over SSH.

If the app is already deployed and you just want to ship a new change, use
**[REDEPLOYMENT.md](./REDEPLOYMENT.md)** instead — most of this document
(VPS setup, DNS cutover, TLS issuance, seed import) is only relevant once.

Domain used throughout this guide: **gyertekvelunk.eu**
(`gyertekvelunk.eu` / `www.gyertekvelunk.eu` → client, `admin.gyertekvelunk.eu` → Strapi admin/API).

## 1. Architecture overview

```
GitHub manual trigger
        │
        ▼
GitHub Actions (.github/workflows/deploy.yml)
  ├─ build server image  ──┐
  ├─ build client image  ──┼─► push to ghcr.io/speti05/gyertek-velunk-{server,client}
  ├─ backup Postgres (SSH, before deploy)
  └─ deploy (SSH: docker compose pull && up -d)
        │
        ▼
VPS: /opt/gyertek-velunk/  (docker compose, opt folder means optional, owned by deploy user)
  ├─ postgres     (named volume: postgres-data)
  ├─ strapi       (image from GHCR, env_file: server/.env.production)
  ├─ client       (image from GHCR)
  ├─ nginx        (reverse proxy + TLS termination, ports 80/443)
  └─ certbot      (Let's Encrypt cert issuance + renewal)
```

Only `nginx` publishes ports to the host (`80`/`443`). `strapi`, `client`,
`postgres` and `certbot` are only reachable over the internal Docker network —
`nginx` reaches them by service name (`http://client:3000`, `http://strapi:1337`).

The workflow is manually triggered (`workflow_dispatch`), see the "Running a deploy" section below for why and how.

## 2. Prerequisites

- A VPS (any provider) with a public IPv4 address, SSH access, and enough RAM
  to run 5 containers (2 GB+ recommended).
- Ownership of the `gyertekvelunk.eu` domain with access to its DNS panel.
- Push access to the `speti05/gyertek-velunk-next-strapi` GitHub repo.

## 3. VPS preparation

login to ssh: (e.g. Windows power shell)

```bash
ssh user@VPS_IP
```

optional: set keyboard to hungarian layout (if you want to type accented letters in the terminal, in websupport web console):

```bash
sudo loadkeys hu
```

refresh the VPS OS and install security updates:

```bash
sudo do-release-upgrade
sudo apt update && sudo apt upgrade -y
```

restart it if its necessary:

```bash
sudo reboot
```

change password for the root VPS user

```bash
sudo passwd root
```

Install Docker and the Docker Compose plugin — this is the **only** software
that needs to be installed directly on the VPS:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out/in again for the group change to apply
docker compose version
```

Postgres, nginx and certbot do **not** need separate installation — they run
as Docker containers defined in `docker-compose.yml` (see the architecture
overview above), so `docker compose up -d` pulls and starts all of them.
Installing e.g. `postgresql` directly on the VPS would be redundant and could
even conflict with the containerized one on port 5432 — don't install it on
the host.

Create the deploy directory:

```bash
sudo mkdir -p /opt/gyertek-velunk
sudo chown $USER:$USER /opt/gyertek-velunk
```

Create a deploy user (or reuse your own) and an SSH key pair that GitHub
Actions will use to connect:

```bash
ssh-keygen -t ed25519 -f gh-actions-deploy -N ""
# append gh-actions-deploy.pub to ~/.ssh/authorized_keys on the VPS
# keep gh-actions-deploy (the private key) - it goes into a GitHub secret below
```

The `gyertek-velunk-server`/`gyertek-velunk-client` GHCR packages are set to
**public** (github.com/speti05?tab=packages → package → Package settings →
Danger Zone → Change visibility), so no `docker login` is needed on the VPS —
`docker compose pull` works anonymously. Only revisit this if the packages
are ever made private again.

## 4. Copy the deploy files to the VPS

Only these files need to live on the VPS — not the whole repo. The
`/opt/gyertek-velunk/deployment` folder doesn't exist yet at this point
(only `/opt/gyertek-velunk` itself was created in step 3), so create it
first, then copy the files from your local machine:
Open an other powershell window (not the ssh session) and run:

```bash
cd "C:\path-to-your-local-folder-of-docker-compose"

ssh user@VPS_IP "mkdir -p /opt/gyertek-velunk/deployment"

scp docker-compose.yml user@VPS_IP:/opt/gyertek-velunk/
scp -r deployment/nginx user@VPS_IP:/opt/gyertek-velunk/deployment/
```

Re-run these `scp` commands any time `docker-compose.yml` or the nginx config
files change.

## 5. Environment variables and secrets

See **[environment_variables_and_secrets_info.md](./environment_variables_and_secrets_info.md)**
for the full breakdown of what goes where and why. Summary:

| Location                                                                                                  | Purpose                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Repo → **Settings** (not your account settings) → Secrets and variables → **Actions** → **Secrets** tab   | `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (the private key from step 3), `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |
| Repo → **Settings** (not your account settings) → Secrets and variables → **Actions** → **Variables** tab | `NEXT_PUBLIC_GA_MEASUREMENT_ID`                                                                       |

Assuming `.env` and `server/.env.production` are already filled in on your
local machine, copy them to the VPS (the `server/` folder doesn't exist
there yet, so create it first, ":" is important to use in the path):

```bash
cd "C:\path-to-your-project-root"
ssh user@VPS_IP "mkdir -p /opt/gyertek-velunk/server"

scp .env user@VPS_IP:/opt/gyertek-velunk/.env
scp server/.env.production user@VPS_IP:/opt/gyertek-velunk/server/.env.production
```

`DATABASE_NAME`/`DATABASE_USERNAME`/`DATABASE_PASSWORD` must be **identical**
in both files — `.env` provisions the Postgres container, `server/.env.production`
is how Strapi connects to it.

## 6. DNS records

_(Do this early — DNS propagation and, later, Let's Encrypt validation both take time.)_

Your current DNS panel (WebSupport) shows `gyertekvelunk.eu` and
`www.gyertekvelunk.eu` pointing at `3x.x.xxx.xxx` (the current WordPress
hosting) and `admin.gyertekvelunk.eu` pointing at `45.xx.xxx.xxx`. Once the
VPS is provisioned and you're ready to cut over, update these **A** (and, if
the VPS has IPv6, **AAAA**) records to point at the new VPS's IP instead:
(VPS ip is in the websupport/vps/control panel/serverinformation->ipv4 part)

| Name                     | Type | Value      |
| ------------------------ | ---- | ---------- |
| `gyertekvelunk.eu`       | A    | `<VPS_IP>` |
| `www.gyertekvelunk.eu`   | A    | `<VPS_IP>` |
| `admin.gyertekvelunk.eu` | A    | `<VPS_IP>` |

Leave the `MX`/`mail.`/`smtp.`/`imap.`/`webmail.` records untouched — those
belong to your email hosting, not this app.

This is a **cutover**: until you change these records, `gyertekvelunk.eu`
keeps serving the existing WordPress site. Only repoint them once you've
verified the new stack works (step 8) — TLS issuance in step 9 also requires
these records to already resolve to the VPS.

## 7. Running a deploy

The workflow (`.github/workflows/deploy.yml`) only runs when triggered
manually. Trigger it either from the GitHub UI (Actions tab → "Build and
Deploy" → Run workflow → branch `main`), or with the GitHub CLI:

```bash
gh workflow run deploy.yml --ref main
gh run watch
```

This builds and pushes both images to GHCR, backs up Postgres (skipped
automatically on the very first run, since there's nothing to back up yet —
see `.github/workflows/backup-postgres.yml`), then SSHes into the VPS and runs
`docker compose pull && docker compose up -d`.

Verify on the VPS:

```bash
cd /opt/gyertek-velunk
docker compose ps                 # all 5 services should be Up
docker compose logs -f strapi     # watch for the schema sync on first boot
docker compose exec postgres psql -U strapi -d strapi -c '\dt'   # confirm tables exist
```

At this point the app is only reachable over plain HTTP on port 80 (via the
bootstrap nginx config already in `deployment/nginx/conf.d/`), and only once
DNS points at the VPS.

## 8. Issuing TLS certificates

Only do this once DNS (step 6) already resolves to the VPS, otherwise
Let's Encrypt's validation request will fail.

"you@example.com" - provide your own email for Let's Encrypt notifications (renewal failures, etc.)

```bash
cd /opt/gyertek-velunk


docker compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d gyertekvelunk.eu -d www.gyertekvelunk.eu \
  --email you@example.com --agree-tos --no-eff-email

docker compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d admin.gyertekvelunk.eu \
  --email you@example.com --agree-tos --no-eff-email
```

Then swap the bootstrap HTTP-only configs for the HTTPS-enabled ones and
reload nginx (no downtime):

```bash
mv deployment/nginx/gyertekvelunk.eu.conf.ssl deployment/nginx/conf.d/gyertekvelunk.eu.conf
mv deployment/nginx/admin.gyertekvelunk.eu.conf.ssl deployment/nginx/conf.d/admin.gyertekvelunk.eu.conf
docker compose exec nginx nginx -s reload
```

The `certbot` service in `docker-compose.yml` keeps running in the
background and renews certificates automatically (checks every 12h; Let's
Encrypt certs are renewed ~30 days before their 90-day expiry). nginx itself
does **not** auto-reload on renewal, so add a weekly cron job on the VPS to
pick up renewed certs:

```bash
# crontab -e
0 4 * * 0 cd /opt/gyertek-velunk && docker compose exec nginx nginx -s reload
```

## 9. Importing seed data

Once Postgres is up and empty (first deploy only):

```bash
scp seed-data.tar.gz deployuser@VPS_IP:/opt/gyertek-velunk/
ssh deployuser@VPS_IP
cd /opt/gyertek-velunk
docker compose cp seed-data.tar.gz strapi:/opt/app/seed-data.tar.gz
docker compose exec strapi yarn strapi import -f /opt/app/seed-data.tar.gz --force
docker compose exec strapi rm /opt/app/seed-data.tar.gz
rm seed-data.tar.gz
```

If there's existing media in `server/public/uploads` that needs to carry
over too (the import above only restores DB records, not the actual files):

```bash
tar czf uploads.tar.gz -C server/public uploads
scp uploads.tar.gz deployuser@VPS_IP:/opt/gyertek-velunk/
ssh deployuser@VPS_IP
cd /opt/gyertek-velunk
docker compose cp uploads.tar.gz strapi:/opt/app/uploads.tar.gz
docker compose exec strapi sh -c "cd /opt/app/public && tar xzf /opt/app/uploads.tar.gz --strip-components=1"
docker compose exec strapi rm /opt/app/uploads.tar.gz
```

After importing, create a fresh, strong-password admin user via
`https://admin.gyertekvelunk.eu/admin` and remove/deactivate any admin
account that came from the imported dev data.

## 10. Backups

Already automated — see `.github/workflows/backup-postgres.yml`:

- Before every manual deploy: dumps Postgres to `backups/deploy/` on the VPS,
  keeps the last 5.
- Daily at 03:00 UTC (`.github/workflows/backup.yml`): dumps to
  `backups/scheduled/`, keeps the last 7.

Both live on the VPS's own disk, so they don't protect against total disk
loss. Periodically copy them off-server, e.g. via a VPS cron job:

```bash
0 4 * * * scp /opt/gyertek-velunk/backups/scheduled/*.sql user@other-host:/backups/gyertek-velunk/
```

## 11. Ongoing maintenance

- **Docker log rotation** — add to every service in `docker-compose.yml` to
  stop logs filling the disk:
  ```yaml
  logging:
    driver: json-file
    options:
      max-size: "10m"
      max-file: "3"
  ```
- **OS security updates**: `sudo apt install -y unattended-upgrades`
- **Uptime monitoring** (optional): an external service (e.g. UptimeRobot)
  watching `https://gyertekvelunk.eu` and `https://admin.gyertekvelunk.eu/admin`.
- **Schema changes**: additive Strapi content-type changes sync
  automatically on container restart. Destructive changes (renaming/removing
  fields) need a migration file under `server/database/migrations/` — back up
  Postgres first (step 10 already covers the routine case; take a manual dump
  before a schema-changing release regardless).
