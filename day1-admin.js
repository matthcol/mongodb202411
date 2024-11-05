// User Management
// https://www.mongodb.com/docs/manual/reference/method/js-user-management/

// create a user dedicated to a business db
// as root
use dbmovie

db.createUser({
    user: "umovie",
    pwd: passwordPrompt(),
    roles: [
        { role: "readWrite", db: "dbmovie" }
    ]
})

db.getUsers()

// as umovie
show dbs // dbmovie only

// create user 'bob' on db admin with readWrite on db dbmovie and read on db admin
use admin

db.createUser({
    user: "bob",
    pwd: "password",
    roles: [
        { role: "readWrite", db: "dbmovie" },
        { role: "read", db: "admin" }
    ]
})

// connect:
// mongosh --username bob --password password admin
// mongosh --username bob --password password --authenticationDatabase admin dbmovie

use dbmovie
db.getUsers() // only users of current db

use admin
db.getUsers() // only users of current db

// all users are stored in an admin system collection
use admin
db.system.users.find()
// or
db.getUsers( { usersInfo: { forAllDBs: true } } )

use admin
db.dropUser("bob")
db.getUsers()

// create another database
use mdb
db.createCollection('titles')




