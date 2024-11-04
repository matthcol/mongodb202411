## Tools
- mongoserver: 
    - installer: https://www.mongodb.com/products/tools/compass
    - distribution Linux: repository + apt/yum/dnf/...
    - docker: https://hub.docker.com/_/mongo
- compass: https://www.mongodb.com/products/tools/compass
- docker desktop on windows with WSL 2:
    - https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package
    - https://docs.docker.com/desktop/install/windows-install/
    
## Connection
- https://www.mongodb.com/docs/mongodb-shell/connect/
- https://www.mongodb.com/docs/manual/reference/connection-string/
- https://www.mongodb.com/docs/manual/reference/connection-string-options/

### Compass
URL = mongodb://root:password@localhost:27017/

### CLI: mongosh
```
docker compose exec -it mongo bash

# with composition name:
docker compose -p docker exec -it mongo bash

# local connection
mongosh
mongosh --username root
mongosh --username root admin
mongosh --username root --password password admin
mongosh --username root --password password --authenticationDatabase admin dbmovie

# with a dedicated user
mongosh --username umovie --password password dbmovie

# with URL
mongosh mongodb://root:password@localhost:27017/admin
mongosh 'mongodb://root:password@localhost:27017/dbmovie?authSource=admin'
```

## Import data
### Compass
### CLI: mongoimport
NB: for distant import add --uri
```
mongoimport --username=root --password=password --db=mdb \
    --authenticationDatabase=admin \
    --collection=titles --file=titles_all.json --jsonArray --type=json
```