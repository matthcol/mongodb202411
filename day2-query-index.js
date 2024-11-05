// DAY 2
// Indexes: 
// https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex
//      (types of indexes, options by type)
// https://www.mongodb.com/docs/manual/core/link-text-indexes/
// https://www.mongodb.com/docs/manual/reference/operator/query/text/
// https://www.mongodb.com/docs/manual/reference/text-search-languages
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/meta


db.names.insertOne({name: 'John Doe', imdbId: 'nm99999999'}) // ok
db.names.insertOne({name: 'John Doe', imdbId: 'nm99999999'}) // 2nd time: MongoServerError: E11000 duplicate key error collection

// updates during index building
// 1st session: create index
db.titles.createIndex({'tconst': 1}, {unique: true}) // MongoServerError[DuplicateKey]: Index build failed
// 2nd session: insert new data violating unique constraint
db.titles.insertOne({title: 'le jour le plus long', tconst: 'tt99999999'}) // 4 times: OK
// Index creation failed at the end:  E11000 duplicate key error collection: mdb.titles index: tconst_1 dup key: { tconst: "tt99999999" }

// cleanup
db.titles.deleteMany({tconst: 'tt99999999'}) // { acknowledged: true, deletedCount: 4 }

// build again index
db.titles.createIndex({'tconst': 1}, {unique: true})

// indexes on text data: 3 choices
// - index normal: {name: 1}
// - index with collation: {name: 1} + option collation
// - index text: {title: text} with language (default: en or fr, es, ...)
//           fr: journal, journaux are the same ; not indexed: le, la, les, du, dans, être, avoir
//           en: animal, animals ; not indexed: the, in, them, have, be  
//           NB: limit = only one index text by collection (can be compound)
//                  { title :text }
//                  { title :text, plot: text }
//                  { titleType: 1, title :text}

db.names.createIndex({name: 1}, {collation: {locale: 'en', strength: 1}})
db.names.getIndexes() // name_1
db.names.dropIndex('name_1')
db.names.createIndex({primaryName: 1}, {collation: {locale: 'en', strength: 1}})

db.names.find({primaryName: 'Irène Aïtoff'}) // don't use index: COLLSCAN
db.names.find({primaryName: 'Irène Aïtoff'}).explain()
db.names.find({primaryName: 'Irène Aïtoff'}).explain("executionStats")

db.names.find({primaryName: 'Irène Aïtoff'}).collation({locale: 'en', strength: 1}) // IXSCAN
db.names.find({primaryName: 'Irène Aïtoff'}).collation({locale: 'en', strength: 1}).explain()
// range inspected in the index: 1 value
indexBounds: {
    primaryName: [
      '[CollationKey(0x394b3143310429394f453333), CollationKey(0x394b3143310429394f453333)]'
    ]
  }
db.names.find({primaryName: 'irene aitoff'}).collation({locale: 'en', strength: 1}) // IXSCAN, 1 value

db.names.find({primaryName: /irene ai/i}).collation({locale: 'en', strength: 1}) // COLLSCAN

db.names.getIndexes()

db.titles.createIndex({primaryTitle: "text"}) // default language: english
// db.titles.createIndex({primaryTitle: "text"}, {default_language: 'fr'})

db.titles.find({title: 'The Terminator'}) // COLLSCAN
db.titles.find(
    {$text: {$search: 'terminator'}}
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1}) // IXSCAN

db.titles.find(
    {
        startYear: {$ne: null},
        $text: {$search: 'terminator'},
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1}) // IXSCAN
// results: Terminator, Terminal, Terminate, Termination

db.titles.find(
    {
        startYear: {$ne: null},
        $text: {$search: '\"the terminator\"'}, // search phrase: the terminator
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1})

db.titles.find(
    {
        startYear: {$ne: null},
        $text: {$search: '\"terminator\"'}, // search phrase: the terminator
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1})

db.titles.find(
    {
        startYear: {$ne: null},
        $text: {$search: 'star legend'},
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1})
// plan:
    parsedTextQuery: {
        terms: [ 'legend', 'star' ],
        negatedTerms: [],
        phrases: [],
        negatedPhrases: []
    },
    inputStage: {
      stage: 'OR',
      inputStages: [
        {
          stage: 'IXSCAN',
          keyPattern: { _fts: 'text', _ftsx: 1 },
          indexName: 'primaryTitle_text',
          isMultiKey: true,
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'backward',
          indexBounds: {}
        },
        {
          stage: 'IXSCAN',
          keyPattern: { _fts: 'text', _ftsx: 1 },
          indexName: 'primaryTitle_text',
          isMultiKey: true,
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'backward',
          indexBounds: {}
        }
      ]
    }
// result contains titles with only 'legend' or only 'star' or both
// 'Legend of Hollywood', 'Riders to the Stars', ...
  
db.titles.find(
    {
        startYear: {$ne: null},
        $text: {$search: '"star" "legend"'},
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1})
// results: 
// - The Brand New Legend of the Stardust Brothers
// - Fist of the North Star: The Legend of Kenshiro

// index compound, multi-key, sparse
db.titles.getIndexes()
db.titles.dropIndex('primaryTitle_text')

// compound index
db.titles.createIndex({titleType: 1, primaryTitle: "text"})

db.titles.find(
    {
        $text: {$search: '"star" "legend"'},
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1}) // IXSCAN

// Error, query doesn't use index, $text cannot be used
db.titles.find(
    {
        $text: {$search: '"star" "legend"'}
    }
).projection(
    {primaryTitle: 1, startYear: 1}
).sort({startYear: 1})

// query using only prefix 'titleType' of the index
db.titles.find(
    {
        titleType: 'movie'
    }
).projection(
    {primaryTitle: 1, startYear: 1}
)

// aggregation with compound index
db.titles.aggregate(
    [
        {
          $match:
            {
              titleType: "movie",
              $text: {
                $search: '"legend" "war"'
              },
              startYear: {
                $ne: null
              }
            }
        },
        {
          $project:
            {
              titleType: 1,
              primaryTitle: 1,
              year: "$startYear",
              directorName: "$director.name"
            }
        },
        {
          $sort:
            {
              year: 1,
              primaryTitle: 1
            }
        }
      ]
)

// 2nd pipeline
db.titles.aggregate([
    {
      $match: // using index
        {
          titleType: "movie",
          $text: {
            $search: '"legend" "war"'
          },
          startYear: {
            $ne: null
          }
        }
    },
    {
      $addFields: {
        actorCount: {
          $size: {
            $ifNull: ["$cast", "$cast", []]
          }
        }
      }
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          actorCount: {
            $gte: 5
          }
        }
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          titleType: 1,
          primaryTitle: 1,
          year: "$startYear",
          directorName: "$director.name"
        }
    },
    {
      $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          year: 1,
          primaryTitle: 1
        }
    }
  ]
)

// match avec $text: must be in 1st place
// Error with following pipeline
[
    {
      $addFields: {
        actorCount: {
          $size: {
            $ifNull: ["$cast", "$cast", []]
          }
        }
      }
    },
    {
      $match: {
        titleType: "movie",
        $text: {
          $search: '"legend" "war"'
        },
        startYear: {
          $ne: null
        }
      }
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          actorCount: {
            $gte: 5
          }
        }
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          titleType: 1,
          primaryTitle: 1,
          year: "$startYear",
          directorName: "$director.name"
        }
    },
    {
      $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          year: 1,
          primaryTitle: 1
        }
    }
  ]


  // by year: nb movies, min duration, max duration, ...
  // by director on a selected list (), nb movies, 1st year, last year, list of movies (title, year)