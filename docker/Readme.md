
## Start composition
```
docker compose up -d
docker-compose -p myproject --env-file .env2 up -d
```
## CLI
docker compose exec -it mongo bash
docker compose exec -it mongo mongosh