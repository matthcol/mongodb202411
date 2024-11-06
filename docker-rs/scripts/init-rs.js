rs.initiate( {
    _id : "rs0",
    members: [
       { _id: 0, host: "mongors01:27017" },
       { _id: 1, host: "mongors02:27017" },
       { _id: 2, host: "mongors03:27017" }
    ]
 })
 