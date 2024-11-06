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