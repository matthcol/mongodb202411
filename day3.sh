mongoexport --username=root --password password  --authenticationDatabase=admin \
    --db=mdb --collection=titles \
    --type=json --jsonArray \
    --out=titles_export.json 
# all titles exported: 10816283  

mongoexport --username=root --password password  --authenticationDatabase=admin \
    --db=mdb --collection=titles \
    --query='{"startYear":1984,"titleType":"movie"}' \
    --type=json --jsonArray \
    --out=movies_1984_export.json 
# 4050 movies exported

mongoexport --username=root --password password  --authenticationDatabase=admin \
    --db=mdb --collection=titles \
    --query='{"startYear":1984,"titleType":"movie"}' \
    --type=csv --fields=tconst,primaryTitle,startYear,director.name \
    --out=movies_1984_export.csv

# NB: mongoimport can use json, csv, tsv files

# backups with mongodump
# https://www.mongodb.com/docs/database-tools/mongodump/mongodump-examples/
mongodump --username=root --password=password  --authenticationDatabase=admin \
    --db=mdb --excludeCollection=namesBd --excludeCollection=weather --out=backup/backup_20241106

mongodump --username=root --password=password  --authenticationDatabase=admin \
    --db=mdb --collection=titles --archive=backup/backup_titles_20241106.gz --gzip
    

# incident 1
# perte/corruption collection
# restore collection
mongorestore --username=root --password=password  --authenticationDatabase=admin \
    --nsInclude=mdb.titles backup/backup_20241106

# NB: if some documents are invalid with a validation layer, you can use option: --bypassDocumentValidation.

# incident 2: perte complete
# remonter une base neuve et restore
# 1. new docker mongodb
docker compose -p mongo2 --env-file .env2 -f docker-compose2.yml up -d
# 2. restore on new docker mongodb
docker compose -p mongo2  exec -it mongo bash
mongorestore --username=root --password=password  --authenticationDatabase=admin \
    --nsFrom=mdb.titles --nsTo=dbmovie.titles \
    --bypassDocumentValidation \
    --archive=/scripts/backup/backup_titles_20241106.gz --gzip

# NB: when failed, drop database
use dbmovie
db.dropDatabase()

