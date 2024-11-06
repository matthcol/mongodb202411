// Builtin roles
// https://www.mongodb.com/docs/manual/reference/built-in-roles/
// read, readWrite, dbOwner, dbAdmin, userAdmin, ..

// Builtin actions
// https://www.mongodb.com/docs/manual/reference/privilege-actions/

// resource definition:
// https://www.mongodb.com/docs/manual/reference/resource-document/


// Example: db = mdb

// Custom role
// fan: find on collections (names, titles)
// fanManager: fan + insert/update on collections (names, titles)



db.getRoles()

db.createRole({
    role: "fan",
    privileges: [
        {resource: {db: "mdb", collection: "names"}, actions: ["find"]},
        {resource: {db: "mdb", collection: "titles"}, actions: ["find"]}
    ],
    roles: []
})

db.createUser({
    user: "toto",
    pwd: "password",
    roles: [
        { role: "fan", db: "mdb" },
    ]
})

// session with user toto
db.names.find()
db.titles.find()
db.titles.aggregate([{
    $match: {
        titleType: 'movie',
        $text: {$search: 'terminator'}
    }
}])

show collections // error: privilege listCollection not granted

db.names.insertOne({
    'primaryName': 'Jane Doe',
    'imdbId': 'nm88888888'
}) // error: privilege insert not granted

// 2nd role and user: fanManager / 
db.createRole({
    role: "fanManager",
    privileges: [
        {resource: {db: "mdb", collection: ""}, actions: ["insert", "update"]},
    ],
    roles: [
        { role: "fan", db: "mdb"}
    ]
})

db.createUser({
    user: "titi",
    pwd: "password",
    roles: [
        { role: "fanManager", db: "mdb" },
    ]
})

// session with user titi
db.names.find()
db.titles.find()
db.titles.aggregate([{
    $match: {
        titleType: 'movie',
        $text: {$search: 'terminator'}
    }
}])

show collections // error: privilege listCollection not granted

db.names.insertOne({
    'primaryName': 'Jane Doe',
    'imdbId': 'nm88888888'
}) // error: privilege insert not granted

db.names.updateOne(
    {
        'imdbId': 'nm88888888'
    },
    {
        $set: {
            birthYear: 1999
        }
    }
)

// role: ultraFan
// db = admin
db.createRole({
    role: "ultraFan",
    privileges: [
        {resource: {db: "mdb", collection: ""}, actions: ["find", "listCollections"]},
        {resource: {db: "dbmovie", collection: ""}, actions: ["find", "listCollections"]},
    ],
    roles: [
    ]
})

db.createUser({
    user: "michel",
    pwd: "password",
    roles: [
        { role: "ultraFan", db: "admin" },
    ]
})

// session michel on db mdb with authentication db admin
// mongosh -u michel -p password --authenticationDatabase admin mdb
db.names.find()

// session michel on db mdb with authentication db admin
// mongosh -u michel -p password --authenticationDatabase admin mdb
db.movies.find()