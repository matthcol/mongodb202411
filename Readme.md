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
```