# Mongodb replica set with 3 replicas

## start containers
docker compose -p mongors up -d

## init replica set
docker compose -p mongors exec -it mongors01 mongosh
load('/scripts/init-rs.js')
