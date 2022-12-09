const { MongoClient, ObjectID } = require("mongodb")

const connectionUrl = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager-db"

MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database: " + connectionUrl)
    }

    const db = client.db(databaseName)
    db.collection("users")
      .find({})
      .toArray((error, result) => {
        if (error) return []
        return result
      })
  }
)

//* insert item or many items to database
//* this commented part down below is refrence

//? insertOne into new collection users
// db.collection("users").insertOne(
//   {

//     name: "Bourahla",
//     age: 26,
//   },
//   (error, result) => {
//     if (error) {
//       return console.log("Unable to insert user")
//     }
//     console.log(result)
//   }
// )

//?insert many users into users collection
// db.collection("users").insertMany(
//   [
//     {
//       name: "maher",
//       age: 36,
//     },
//     {
//       name: "salem",
//       age: 32,
//     },
//     {
//       name: "ahmed",
//       age: 54,
//     },
//     {
//       name: "sayed",
//       age: 24,
//     },
//   ],
//   (error, result) => {
//     if (error) {
//       return console.log(error)
//     }
//     console.log(result)
//   }
// )

//? insert many items into new collection tasks
// db.collection("tasks").insertMany(
//   [
//     {
//       title: "Note title 1",
//       description: "note description 1",
//       completed: true,
//     },
//     {
//       title: "Note title 2",
//       description: "note description 2",
//       completed: false,
//     },
//     {
//       title: "Note title 3",
//       description: "note description 3",
//       completed: true,
//     },
//   ],
//   (error, result) => {
//     if (error) return console.log('Unable to create notes')
//     console.log(result)
//   }
// )

//* get item or many items (all or specified items) from database
//* refrence
//? get items by _id from users collection
// db.collection("users").findOne(
//   { _id: ObjectID("6375cd80d09816d62c65149b") },
//   (error, user) => {
//     if (error) {
//       return console.log("Unable to fetch user")
//     }

//     console.log(user)
//   }
// )

//? get all items
// db.collection("users")
//   .find({})
//   .toArray((error, users) => {
//     console.log(users)
//   })

//? get number of items by age
// db.collection("users")
//   .find({ age: 26 })
//   .count((error, count) => {
//     console.log(count)
//   })

//? update item and many items
// db.collection("tasks")
//   .updateMany({ completed: false }, { $set: { completed: true } })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// db.collection("users")
//   .updateOne(
//     { _id: new ObjectID("6375df092f5d9336c3aee044") },
//     {
//       $set: {
//         name: "Mike Smith",
//       },
//     }
//   )
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => console.log(error))

//? delete item and many items

// db.collection("tasks")
//   .deleteOne({ title: "Note title 1" })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// db.collection("users")
//   .deleteMany({
//     age: 25,
//   })
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => {
//     console.log(error)
//   })
