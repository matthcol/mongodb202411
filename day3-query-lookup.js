db.titles.createIndex(
    {
        "director.imdbId": 1
    },
    {
        collation: {
            locale: 'en',
            strength: 1
        }
    }
)

db.titles.createIndex(
    {
        "cast.imdbId": 1
    },
    {
        collation: {
            locale: 'en',
            strength: 1
        }
    }
)

db.names.aggregate(
    [
        {
          $match:
            {
              primaryName: {
                $in: [
                  "Steve McQueen",
                  "Clint Eastwood",
                  "Steven Speilberg",
                  "jean-claude van damme"
                ]
              }
            }
        },
        {
          $lookup: {
            from: "titles",
            localField: "imdbId",
            foreignField: "director.imdbId",
            pipeline: [
              {
                $match: {
                  titleType: "movie"
                }
              }
            ],
            as: "directedMovies"
          }
        },
        {
          $lookup: {
            from: "titles",
            localField: "imdbId",
            foreignField: "cast.imdbId",
            pipeline: [
              {
                $match: {
                  titleType: "movie"
                }
              }
            ],
            as: "playedMovies"
          }
        },
        {
          $addFields:
            {
              directedMovies: {
                $map: {
                  input: "$directedMovies",
                  as: "movie",
                  in: {
                    imdbId: "$$movie.tconst",
                    year: "$$movie.startYear",
                    title: "$$movie.primaryTitle",
                    director: true
                  }
                }
              },
              playedMovies: {
                $map: {
                  input: "$playedMovies",
                  as: "movie",
                  in: {
                    imdbId: "$$movie.tconst",
                    year: "$$movie.startYear",
                    title: "$$movie.primaryTitle",
                    actor: true
                  }
                }
              }
            }
        },
        // {
        //   $match:
        // check person with no filmography
        //     {
        //       imdbId: "nm7757128"
        //     }
        // }
        {
          $addFields: {
            filmography: {
              $concatArrays: [
                "$playedMovies",
                "$directedMovies"
              ]
            }
          }
        },
        {
          $unwind: {
            path: "$filmography",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: {
              nmImdbId: "$imdbId",
              primaryName: "$primaryName",
              birthYear: "$birthYear",
              ttImdbId: "$filmography.imdbId"
            },
            movie: {
              $mergeObjects: "$filmography"
            }
          }
        },
        {
          $addFields:
            {
              movie: {
                $cond: {
                  if: {
                    $eq: ["$movie", {}]
                  },
                  then: "$$REMOVE",
                  else: "$movie"
                }
              }
            }
        },
        {
          $group: {
            _id: {
              imdbId: "$_id.nmImdbId",
              primaryName: "$_id.primaryName",
              birthYear: "$_id.birthYear"
            },
            filmography: {
              $push: "$movie"
            }
          }
        },
        {
          $project: {
            imdbId: 1,
            name: "$primaryName",
            birthYear: 1,
            filmography: {
              $sortArray: {
                input: "$filmography",
                sortBy: {
                  year: -1
                }
              }
            }
          }
        }
      ],
      {collation: { locale: 'en', strength: 1}}
)