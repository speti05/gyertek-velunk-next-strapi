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
