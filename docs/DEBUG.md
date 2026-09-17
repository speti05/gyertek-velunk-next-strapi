# Reading logs

```bash
ssh deployuser@VPS_IP

docker compose logs --tail=100 client
docker compose logs --tail=100 strapi
docker compose logs --tail=100 nginx
docker compose logs --tail=100 postgres
```

Verify on the VPS:

```bash
cd /opt/gyertek-velunk
docker compose ps                 # all 5 services should be Up
docker compose logs -f strapi     # watch for the schema sync on first boot
docker compose exec postgres psql -U strapi -d strapi -c '\dt'   # confirm tables exist
```

Force restart of a container:

```bash
docker compose restart client
```

Force recreate of a container (careful!):

```bash
docker compose up -d --force-recreate client
```

Which variables are set in `server/.env.production`?

```bash
cd /opt/gyertek-velunk

grep -oE '^[A-Z_][A-Z0-9_]*' server/.env.production   # names only, keeps secrets off screen
docker compose exec strapi printenv CLIENT_URL STRAPI_URL   # what the container actually got
```

The second line matters: editing `.env.production` only reaches the container after
`docker compose up -d --force-recreate strapi`, a plain restart keeps the old environment.

Which commit is running on the VPS?

```bash
cd /opt/gyertek-velunk

for service in strapi client; do
  printf '%s: ' "$service"
  docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$(docker compose ps -q "$service")"
done
```

The deploy workflow stamps the commit SHA into every image it builds; an empty line means
the container still runs an image built before that.

Check the build date of the image:

```bash
docker inspect --format '{{.Created}}' ghcr.io/speti05/gyertek-velunk-server:latest
```

Not a freshness indicator: a fully cached rebuild reproduces the same image config with the
original timestamp. Use the revision label above instead.

# Testing an image locally

Build and run the production images on your own machine before deploying, so a broken
Dockerfile fails here instead of on the VPS:

```bash
yarn docker:local:strapi   # Strapi only
yarn docker:local          # the whole stack
```

Both wrap `docker compose up --build` on `docker-compose.local.yml`. Strapi comes up on
`http://localhost:1337`, the client on `http://localhost:3000`.

The scripts pass `client/.env.local` to compose as an env file on purpose: Next.js inlines
`NEXT_PUBLIC_*` into the bundle at build time, so those values have to reach the client
image as build args. Without them the site still renders server-side, but browser-side
Strapi calls and reCAPTCHA break on empty URLs and keys. Run `yarn setup` first if
`client/.env.local` does not exist yet.

Worth knowing: the local compose file mounts a fresh `strapi-data` volume over `.tmp` and
uses SQLite, so the database starts empty — `/admin` will ask you to register an admin
user. That is the empty volume, not a broken image. What this actually verifies is that
the container starts at all (`dist/` is present) and that the admin panel loads
(`dist/build/` is present).

Compare the size against what runs on the VPS:

```bash
docker image ls gyertek-velunk-next-strapi-strapi
```

## Stop the local stack when you are done

```bash
docker compose -f docker-compose.local.yml down
```

Leave it running and the next `yarn dev` session is broken in a way that looks like an
application bug. The container holds port 1337, so `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
reaches the container instead of the local Strapi — and because the local compose file mounts
its own `strapi-data` volume, that is a different SQLite database. Its Public role only has the
permissions `src/index.ts` grants at bootstrap, none of the `api::*` reads you set up in the
admin panel, so **every** content endpoint answers 403:

```bash
curl -s http://localhost:1337/api/global   # {"data":null,"error":{"status":403,...}}
```

The loaders swallow that and return nothing, so the site renders with no header, no footer and
no blocks — a blank page, with the dev server reporting 200 and no error.

The tell is that the 403 covers *every* endpoint. Before checking permissions, check who owns
the port:

```bash
docker ps                 # is a strapi container still up?
netstat -ano | grep :1337 # windows
lsof -i :1337             # macos/linux
```

`down` leaves the volume intact, so the container's own database survives for the next test run.

# Disk space

```bash
df -h /                 # how much is used/free
docker system df        # how much of it Docker holds (images, volumes, build cache)
```

To find what actually fills the disk, `ncdu` is by far the easiest way to browse
files — it shows every directory sorted by size and you navigate with the arrow keys:

```bash
sudo apt install -y ncdu
sudo ncdu /
```

## Cleaning up old Docker images

Old images are the usual reason the VPS fills up. The deploy keeps only the current and
the previous version, so run this only to clear a backlog:

```bash
docker system df        # the RECLAIMABLE column is what you get back
docker image prune -af  # -a matters: every old image carries a :<commit-sha> tag
df -h /
```

Images of running containers are never touched, and anything deleted can be pulled again
from GHCR. Per-image sizes in `docker image ls` are misleading — shared layers are counted
once per image.

**Never run** `docker system prune -a --volumes` — `--volumes` deletes the Postgres
database and the Strapi uploads.

If the disk is still full, the space is not in images: check `/var/lib/docker/volumes`,
`/var/log` and `/opt/gyertek-velunk/backups` with `ncdu`.
