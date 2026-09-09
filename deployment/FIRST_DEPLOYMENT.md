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

# this command will create two files in the current folder:
# 1: gh-actions-deploy (private key) - keep this secret, it goes into a GitHub secret .Its content goes to the `VPS_SSH_KEY` secret in the repo settings

# looks like something like this:
# -----BEGIN OPENSSH PRIVATE KEY-----
# blallballaaVErylongkeyasddfsdfdsfsfd....
# -----END OPENSSH PRIVATE KEY-----

# 2: gh-actions-deploy.pub (public key) - append this to ~/.ssh/authorized_keys on the VPS
# append gh-actions-deploy.pub to ~/.ssh/authorized_keys on the VPS
type gh-actions-deploy.pub | ssh user@VPS_IP "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
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
| Repo → **Settings** (not your account settings) → Secrets and variables → **Actions** → **Variables** tab | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_SITE_URL`                     |

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

verify the DNS change has propagated (it can take 10 minutes,if TTL is 600) with:

```bash
    getent ahosts gyertekvelunk.eu       # should list both the v4 and v6 VPS addresses

    curl.exe -4 http://gyertekvelunk.eu/
    curl.exe -6 http://gyertekvelunk.eu/

```

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

Only start this once DNS (step 6) already resolves to the VPS - Let's Encrypt
validates by fetching a file over plain HTTP on port 80, so it fails otherwise.

**This whole step is safe to restart from the top.** If an earlier attempt left
things half-finished, just work through 8.1 - 8.6 in order: 8.2 puts nginx back
into a known-good state before anything else happens.

### Which window to run what in

Keep two terminals open side by side - it saves a lot of confusion:

| Window    | What it is                                   | How to open it                                                        |
| --------- | -------------------------------------------- | --------------------------------------------------------------------- |
| **[VPS]** | An SSH session on the server                 | PowerShell -> `ssh user@VPS_IP` -> `cd /opt/gyertek-velunk`           |
| **[LOC]** | A plain PowerShell in your local repo folder | A **second** PowerShell window -> `cd "C:\path-to-your-project-root"` |

Every block below is tagged **[VPS]** or **[LOC]**. Don't run a **[LOC]** block
inside the SSH session - `scp` there would try to copy from the server, which is
not what you want. Run the blocks one at a time and check the expected output
before moving on; skipping ahead is what makes this step hard to unpick.

### 8.1 Check that DNS points at this VPS

**[VPS]**

```bash
cd /opt/gyertek-velunk
getent hosts gyertekvelunk.eu www.gyertekvelunk.eu admin.gyertekvelunk.eu
curl -s ifconfig.me; echo
```

All three hostnames must resolve to the address `ifconfig.me` prints (this
VPS). If any of them still points somewhere else, go back to step 6 and wait
for propagation - **do not** run certbot yet. Let's Encrypt allows only 5
failed validations per hostname per hour, and burning through them means
waiting an hour before you can try again.

### 8.2 Start from the HTTP-only bootstrap configs

certbot needs port 80 answering over plain HTTP, which only the _bootstrap_
configs do. Check which set is currently active:

**[VPS]**

```bash
ls deployment/nginx deployment/nginx/conf.d
```

Expected: the two `*.conf.ssl` files sit in `deployment/nginx/`, and `conf.d/`
holds the two bootstrap `*.conf` files. **If that is what you see, skip to 8.3.**

If `conf.d/` holds the SSL versions instead (an earlier attempt moved them
there), move them back out and re-copy the bootstrap files, which are still
tracked in git locally:

**[VPS]**

```bash
mv deployment/nginx/conf.d/gyertekvelunk.eu.conf deployment/nginx/gyertekvelunk.eu.conf.ssl
mv deployment/nginx/conf.d/admin.gyertekvelunk.eu.conf deployment/nginx/admin.gyertekvelunk.eu.conf.ssl
```

**[LOC]**

```powershell
cd "C:\path-to-your-project-root"
scp deployment/nginx/conf.d/*.conf user@VPS_IP:/opt/gyertek-velunk/deployment/nginx/conf.d/
```

Then bring nginx back up and confirm plain HTTP works:

**[VPS]**

```bash
docker compose up -d nginx
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
curl -I http://gyertekvelunk.eu
```

`nginx -t` must print `syntax is ok` / `test is successful`, and the `curl` must
return an HTTP status line (200 or a 3xx), not a connection error. Don't go
further until both are true.

### 8.3 Issue the certificates

Replace `you@example.com` with your own address (Let's Encrypt uses it for
expiry and renewal-failure notices). Run the commands **one at a time** - each
is a single line, so paste it whole.

**Always run each command with `--dry-run` first, and only re-run it without
the flag once the dry run succeeds.** Reason: Let's Encrypt enforces a limit of
**5 failed validations per hostname per hour**. Hit it and you are locked out of
that hostname for an hour - which, mid-deployment, is a long time to stare at a
broken site. And validation failures are the norm on a first deployment: a stale
DNS record, an AAAA pointing at the old host, nginx serving the wrong config.
`--dry-run` runs the identical request against Let's Encrypt's **staging**
environment, which has far higher limits, so a failure there costs nothing. It
exercises the whole path - DNS resolution, port 80 reachability, the webroot,
the challenge file - and only skips issuing a real certificate. In other words:
a passing dry run is proof that the real run will work, bought for free.

#### First: the dry runs

**[VPS]**

```bash
docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d gyertekvelunk.eu -d www.gyertekvelunk.eu --email you@example.com --agree-tos --no-eff-email --dry-run
```

```bash
docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d admin.gyertekvelunk.eu --email you@example.com --agree-tos --no-eff-email --dry-run
```

Each must end with **`The dry run was successful.`** If either fails, fix the
cause and repeat the dry run - as often as needed, it stays free. The
troubleshooting section below covers the usual causes; the `Detail:` line in the
error names the IP address Let's Encrypt actually connected to, which is the
single most useful clue (if it is not your VPS's address, the problem is DNS).

Note that a dry run writes **no certificate** - `/etc/letsencrypt/live/` stays
empty afterwards. That is expected, not a failure.

#### Then: the real runs

Only once both dry runs pass, run the exact same commands **without**
`--dry-run`:

**[VPS]**

```bash
docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d gyertekvelunk.eu -d www.gyertekvelunk.eu --email you@example.com --agree-tos --no-eff-email
```

```bash
docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d admin.gyertekvelunk.eu --email you@example.com --agree-tos --no-eff-email
```

Each should finish within seconds and print `Successfully received certificate`
plus the path under `/etc/letsencrypt/live/`.

#### Why `--entrypoint certbot` is required

It is not optional. The `certbot` service in `docker-compose.yml` overrides the
image's entrypoint with the renewal loop
(`sh -c "... while :; do certbot renew; sleep 12h; done"`). Without the flag,
`certonly ...` is passed as positional arguments to that `sh -c` script, which
ignores them - so the container silently runs the renewal loop (finding nothing
to renew) and hangs on `sleep 12h` instead of issuing anything. The flag
restores the image's default entrypoint so the arguments take effect.

> **If a command just sits there** printing nothing (or something about renewal)
> instead of finishing: that is the missing `--entrypoint certbot`. Press
> `Ctrl+C` and re-run the line exactly as written above. No certificate was
> issued, and nothing was damaged.

### 8.4 Verify the certificates actually exist

**[VPS]**

```bash
docker compose run --rm --entrypoint sh certbot -c "ls -la /etc/letsencrypt/live/"
```

You must see a directory for `gyertekvelunk.eu` **and** one for
`admin.gyertekvelunk.eu`. If either is missing, do not continue to 8.5 - the
nginx reload there would fail with the same "cannot load certificate" error. Go
back to 8.1/8.3 and fix the cause first.

If a directory carries a numeric suffix (`admin.gyertekvelunk.eu-0001`, left by
an earlier partial issuance), the `ssl_certificate` / `ssl_certificate_key`
paths in the matching `.conf.ssl` file must be pointed at that exact directory
name before you continue.

### 8.5 Swap in the HTTPS configs and reload

Only now, with both certificates confirmed present:

**[VPS]**

```bash
mv deployment/nginx/gyertekvelunk.eu.conf.ssl deployment/nginx/conf.d/gyertekvelunk.eu.conf
mv deployment/nginx/admin.gyertekvelunk.eu.conf.ssl deployment/nginx/conf.d/admin.gyertekvelunk.eu.conf
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

Always run `nginx -t` before the reload - it validates the config without
touching the running server, so a mistake here costs no downtime. A failed
`reload` leaves the _running_ nginx on its previous config, but the files on
disk are already the SSL ones, so the next `docker compose up -d` would
crash-loop nginx. That is exactly the state 8.2 undoes.

### 8.6 Verify HTTPS

**[LOC]** - in PowerShell `curl` is an alias for `Invoke-WebRequest`, so call
`curl.exe` explicitly:

```powershell
curl.exe -I https://gyertekvelunk.eu
curl.exe -I https://admin.gyertekvelunk.eu
curl.exe -I http://gyertekvelunk.eu     # expect 301 -> https
```

Then open both hostnames in a browser and check the padlock.

### Troubleshooting: "cannot load certificate"

```
[emerg] cannot load certificate "/etc/letsencrypt/live/admin.gyertekvelunk.eu/fullchain.pem":
BIO_new_file() failed (... No such file or directory ...)
```

The certificate named in the message was never issued - almost always a certbot
run without `--entrypoint certbot` (8.3), or DNS not yet resolving to the VPS
(8.1). nginx reports only the _first_ failure it hits and loads `conf.d/`
alphabetically, so an error naming `admin.` tells you nothing about whether the
main domain's certificate exists - check both in 8.4.

Recovery: restart this step at 8.2, which moves the SSL configs back out and
restores plain HTTP, then continue through 8.3 - 8.6.

### Automatic renewal

The `certbot` service in `docker-compose.yml` keeps running in the background
and renews certificates automatically (checks every 12h; Let's Encrypt certs are
renewed ~30 days before their 90-day expiry). nginx itself does **not**
auto-reload on renewal, so add a weekly crfon job on the VPS to pick up renewed
certs:

**[VPS]**

```bash
(crontab -l 2>/dev/null; echo "0 4 * * 0 cd /opt/gyertek-velunk && docker compose exec -T nginx nginx -s reload") | crontab -

# list the cron jobs to verify it was added:
crontab -l
```

## 9. Importing seed data

Use **`seed-data-live.tar.gz`** for the production import, not `seed-data.tar.gz`.

`seed-data.tar.gz` is the full development export - it also carries articles,
blogs, newsletters, event signups and contact requests from the dev database,
several of which contain real personal data (names, e-mail addresses, birth
dates, document numbers) that has no business being in the live database.
`seed-data-live.tar.gz` is the trimmed version, containing only what the live
site needs to come up:

| Content                     | Records                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Page                        | 14 (7 pages, draft + published: `rolunk`, `beszamolok`, `blog`, `aszf`, `adatvedelem`, `utazasi-szerzodes`, `hibabejelentes`) |
| Global (single type)        | 2 (draft + published)                                                                                                         |
| Home Page (single type)     | 2 (draft + published)                                                                                                         |
| Site Settings (single type) | 1                                                                                                                             |
| Media library               | 35 file records + 2 folders, 143 files under `assets/uploads/`                                                                |
| Roles & permissions         | 2 roles + 33 permissions (this restores the Public role's endpoint access)                                                    |
| Locales                     | 2                                                                                                                             |

Everything else - articles, blogs, events, newsletters, signups, contact
requests, and the dev `admin::session` rows - is deliberately excluded. Add that
content through the admin panel on the live site instead.

Regenerate `seed-data-live.tar.gz` from a fresh export with
`deployment/build-live-seed.py` (run it from the repo root) ONLY if the base content ever changes.

### 9.1 Import the content

**[LOC]**

```powershell
scp seed-data-live.tar.gz user@VPS_IP:/opt/gyertek-velunk/
```

**[VPS]**

```bash
cd /opt/gyertek-velunk
docker compose cp seed-data-live.tar.gz strapi:/opt/app/seed-data-live.tar.gz
docker compose exec strapi yarn strapi import -f /opt/app/seed-data-live.tar.gz --force --exclude files
```

`--exclude files` is **required**. Without it the import tries to back up the
existing assets by renaming `public/uploads` to `public/uploads_backup_<ts>` -
but that directory is a Docker volume mount point, and a mount point cannot be
renamed. The rename fails with `EBUSY` and Strapi reports it as the misleading
`The backup folder for the assets could not be created inside the public folder.
Please ensure Strapi has write permissions on the public directory`. It is not a
permissions problem; the container runs as root.

`--force` **deletes the existing content** before importing. Your admin account
survives (the `admin_users` table is never part of an export), but the Public
role's permissions are overwritten by the ones in the archive.

### 9.2 Restore the media files

The step above imported the media _records_ but not the actual files, so put
those in place from the same archive:

**[VPS]**

```bash
docker compose exec strapi sh -c "mkdir -p /tmp/seed && tar xzf /opt/app/seed-data-live.tar.gz -C /tmp/seed && cp -a /tmp/seed/assets/uploads/. /opt/app/public/uploads/ && ls /opt/app/public/uploads | wc -l && rm -rf /tmp/seed"
```

Expect a count of ~143. The archive is unpacked in full rather than by
subdirectory because Alpine's busybox `tar` matches member names exactly and the
archive has no `assets/uploads/` directory entry - `tar xzf … assets/uploads`
fails with `not found in archive`.

`cp -a` writes _through_ the volume mount, which is fine; only renaming the
mount point itself is impossible.

### 9.3 Clean up and restart

**[VPS]**

```bash
docker compose exec strapi rm /opt/app/seed-data-live.tar.gz
docker compose up -d --force-recreate client
```

The client is force-recreated rather than restarted so that Next.js's on-disk
fetch cache is discarded - otherwise it keeps serving the responses it cached
before the import.

### 9.4 Verify

**[VPS]**

```bash
docker compose exec postgres psql -U strapi -d strapi -c "select 'home_pages' t, count(*) from home_pages union all select 'globals', count(*) from globals union all select 'pages', count(*) from pages;"
docker compose logs --tail=30 strapi | grep -E "api/(global|home-page)"
```

The counts must be non-zero, and the API requests must return `200` - a `403`
means the Public role is missing an endpoint permission, a `404` means the
single type exists only as a draft and needs publishing in the admin panel.

Watch the import output itself for `error:` lines too. A foreign-key violation
(`Key (…) is not present in table …`) aborts the transaction, and every write
after it is silently discarded - the import then appears to finish while leaving
the database half-empty.

### 9.5 Admin account

Admin panel accounts are never included in an export, so `/admin` shows the
"Welcome to Strapi" registration form on a fresh database. That is expected.

Create the account from the command line rather than the browser, so the
password is not sent in the clear before TLS is up (and does not land in your
shell history - run it with no flags and it prompts):

**[VPS]**

```bash
docker compose exec strapi yarn strapi admin:create-user
```

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
