// list of all BSON types
// https://www.mongodb.com/docs/manual/reference/bson-types/

db.namesBd.insertMany([
    { name: 'Tom Cruise', birthdate: ISODate('1962-07-03') },
    { name: 'Margot Robbie', birthdate: ISODate('1990-07-02') },
    { name: 'Jared Leto', birthdate: ISODate('1971-12-26') },
])

// finds:
// a specific date
    {birthdate: ISODate('1962-07-03')}
// a part of the date
db.namesBd.find({$expr:{$eq: [{$month: "$birthdate"},7]}})

db.namesBd.aggregate([
    {
      $addFields: {
        month: { $month: "$birthdate" }
      }
    },
    {
      $match: { month: 7 }
    }
  ])

// https://www.mongodb.com/docs/manual/core/timeseries-collections/
db.createCollection(
    "weather",
    {
       timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "seconds"
       },
       expireAfterSeconds: 86400
    }
 )

 db.weather.insertMany( [
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-05T00:00:00.000Z"),
       temp: 12
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-05T04:00:00.000Z"),
       temp: 11
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-05T08:00:00.000Z"),
       temp: 11
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-05T12:00:00.000Z"),
       temp: 12
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-05T16:00:00.000Z"),
       temp: 16
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-05T20:00:00.000Z"),
       temp: 15
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-06T00:00:00.000Z"),
       temp: 13
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-06T04:00:00.000Z"),
       temp: 12
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-06T08:00:00.000Z"),
       temp: 11
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-06T12:00:00.000Z"),
       temp: 12
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-06T16:00:00.000Z"),
       temp: 17
    },
    {
       metadata: { sensorId: 5578, type: "temperature" },
       timestamp: ISODate("2024-11-06T20:00:00.000Z"),
       temp: 12
    }
 ] )


 // query using index
 [
    {
      $match: {
        timestamp: {
          $gte: ISODate("2024-11-05T12"),
          $lt: ISODate("2024-11-06T00")
        }
      }
    }
  ]