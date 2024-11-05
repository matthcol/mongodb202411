use dbmovie

db.movies.find()

// new collection
db.persons.insertOne({
    name: 'Michael Bay'
}) // returns object JSON with generated _id
db.persons.find()

db.persons.insertMany([
    {
        name: 'Steven Spielberg'
    },
    {
        name: 'Tim Burton'
    },
]) // returns object JSON with generated _id(s)

// NB: _id has type ObjectId represented in hexadecimal
//     Ex: ObjectId('6728ae1e796b585d4ffe6911') # 24 digits

// find by id
db.persons.find(ObjectId('6728aea0796b585d4ffe6913'))
db.persons.find({
    _id: ObjectId('6728aea0796b585d4ffe6913')
})

// filter data (selection)
db.movies.find({year: 2024})
db.movies.find({title: 'Dune: Part Two'})
db.movies.find({title: 'dune: part two'}) // no result (case sensitive)
db.movies.find({title: {$regex: /^dune: part two$/i}})

// list operators
// https://www.mongodb.com/docs/manual/reference/operator/query/

// switch to more complete db

// operator: $regex
use mdb
db.titles.find({primaryTitle: {$regex: /^dune: part two$/i}})

// and between 2 filters
db.titles.find({
    primaryTitle: {$regex: /^dune: part two$/i}, // operator $regex
    titleType: 'movie'  // operator ==
})
db.titles.find({
    primaryTitle: {$regex: "^dune: part two$", $options: "i"}, 
    titleType: 'movie'  // operator ==
})

// string contains
db.titles.find({
    primaryTitle: {$regex: "dune", $options: "i"}, 
    titleType: 'movie'  // operator ==
})

// starts with
db.titles.find({
    primaryTitle: {$regex: "^dune", $options: "i"}, 
    titleType: 'movie'  // operator ==
})


// exercice with some operators
// - comparison: 
//      * $eq, $ne: =, !=
//      * $lt, $lte, $gt, $gte: <, <=, >, >=
//      * $in, $nin: in, not in

// - film des années 1990 (1990 à 1999)
{titleType: "movie", startYear: {$gte: 1990, $lte: 1999}}
// - film durée supérieure à 3H
// - film avec titre dans la liste: The Terminator, Dune, Beetlejuice
{ titleType: "movie", primaryTitle: {$in: ["The Terminator","Dune","BeetleJuice"]} }
// - film réalisé par Clint Eastwood
{ titleType: "movie", "director.name": "Clint Eastwood" }

// titles with runtimeMinutes as string ??
db.titles.find({runtimeMinutes: {$regex: "[^0-9]"}}) // mix columns genres2 and runtimeMinutes
db.titles.find({runtimeMinutes: null}) // SQL: is null
db.titles.find({runtimeMinutes: {$ne: null}}) // SQL: is not null

// update: updateOne, updateMany

// - set runtimeMinutes to null when runtimes has a non-digit char
db.titles.updateMany(
    {runtimeMinutes: {$regex: "[^0-9]"}},
    { $set: { runtimeMinutes : null } }  // or { $unset:  "runtimeMinutes" }
) // =>  modifiedCount: 630

// - set runtimeMinutes to int value when runtimes is not null ($toInt)
db.titles.updateMany({}, [{$set: {runtimeMinutes: {$toInt: '$runtimeMinutes'}}}])
// result:  { matchedCount: 11174655,  modifiedCount: 3528131 }

// - rename keys: role => cast, genres2 => genre, director.imdId => director.imdbId
db.titles.updateMany(
    {},
    { $rename: { 'role': 'cast', 'genres2': 'genre' } }
)

db.titles.updateMany(
    {director: {$ne: null}},
    { $rename: { 'director.imdId': 'director.imdbId' } }
)

db.titles.find({director: null}).limit(2)
db.titles.find({director: {$ne: null}}).limit(2)


// delete: delete, deleteMany
// - remove titles with isAdult: 1
db.titles.deleteMany(
    { isAdult: 1}
)
// result: { acknowledged: true, deletedCount: 358373 }

// collation: collection, view, index, query(find, agreggate, update, delete, ...)
// https://www.mongodb.com/docs/manual/reference/collation/

db.names.find({primaryName: {$regex: '^Irene'}}) // 5807
db.names.find({primaryName: {$regex: '^Irène'}}) // 288
db.names.find({primaryName: {$regex: '^irene'}}) // 0

db.names.find(
    {primaryName: {$regex: '^irene'}}
).collation(
    {
        locale: 'fr',
        strength: 1
    }
) // does not work with regexp

db.names.find(
    {primaryName: 'irene helbongo'}
).collation(
    {
        locale: 'fr',
        strength: 1
    }
) // found: 'Irène Helbongo'

db.names.find(
    {primaryName: {$regex: /^ir[eè]ne/i}}
).collation(
    {
        locale: 'fr',
        strength: 1
    }
).sort({
    primaryName: 1
})


db.names.find(
    {primaryName: {$regex: '^Irène'}}
) .collation(
    {
        locale: 'en', // 'fr', 'es', 'fr_FR'
        strength: 1
    }
).sort({
    primaryName: 1
})
//  ... 'Irène Afker', 'Irène Aïtoff', 'Irène Ajer'

db.createCollection(
    "words",
    {
        collation: {
            locale: 'fr',
            strength: 1
        }
    }
)
db.words.insertMany([
    { word: 'étage' },
    { word: 'été' },
    { word: 'étuve' },
    { word: 'cœur' },
    { word: 'cobra' },
    { word: 'corde' },
    { word: 'garçon' },
    { word: 'garage' },
    { word: 'gardien' },
])

db.words.find().sort({word: 1})
db.words.find({word: 'coeur'}) // find: cœur

// remove whole collection
db.words.drop()

// back to names and titles
db.names.find({ primaryName: 'Irène Aïtoff'}) // colscan: cost = 13884604 (4,7s)

db.names.countDocuments() // 13884604
db.titles.countDocuments() // 10816282

// EXPRESS_IXSCAN
// index scan, cost ~ 23/24 comparisons (0ms)
//   cost = log(13884604)
db.names.find(ObjectId('6728c35434ce15d25a85b5f8')) 

db.names.find({imdbId: 'nm0000128'}) // COLLSCAN

db.names.createIndex(
    // key(s)
    { 'imdbId': 1 },
    // option(s)
    { unique: true }
)
db.names.find({imdbId: 'nm0000128'}) // EXPRESS_IXSCAN
