db.runCommand( { collMod: "titles",
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'tconst',
          'primaryTitle'
        ],
        properties: {
          tconst: {
            bsonType: 'string',
            pattern: '^tt[0-9]{6,}$'
          },
          titleType: {
            'enum': [
              'movie',
              'short',
              'tvEpisode',
              'tvMiniSeries',
              'tvMovie',
              'tvPilot',
              'tvSeries',
              'tvShort',
              'tvSpecial',
              'video',
              'videoGame'
            ]
          },
          primaryTitle: {
            bsonType: 'string'
          },
          originalTitle: {
            bsonType: 'string'
          },
          isAdult: {
            bsonType: 'int',
            minimum: 0,
            maximum: 1
          },
          startYear: {
            bsonType: [
              'int',
              'null'
            ],
            minimum: 1888
          },
          endYear: {
            bsonType: [
              'int',
              'null'
            ],
            minimum: 1888
          },
          runtimeMinutes: {
            bsonType: [
              'int',
              'null'
            ],
            minimum: 1
          },
          genre: {
            bsonType: 'array',
            items: {
              bsonType: 'string'
            }
          },
          director: {
            bsonType: [
              'object',
              'null'
            ],
            properties: {
              imdbId: {
                bsonType: 'string',
                pattern: '^nm[0-9]{6,}$'
              },
              name: {
                bsonType: 'string'
              }
            }
          },
          cast: {
            bsonType: [
              'array',
              'null'
            ],
            items: {
              bsonType: 'object',
              properties: {
                imdbId: {
                  bsonType: 'string',
                  pattern: '^nm[0-9]{6,}$'
                },
                primaryName: {
                  bsonType: 'string'
                },
                characters: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
   validationLevel: "moderate"
})