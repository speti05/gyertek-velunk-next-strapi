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
