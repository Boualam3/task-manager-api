const express = require("express")
const path = require("path")
const connectDB = require("./db/mongoose")
require("dotenv").config()
const userRouter = require("./routers/user")
const taskRouter = require("./routers/tasks")

const app = express()
const port = process.env.PORT || 5000
console.log(require("dotenv").config())

app.use(express.urlencoded({ extended: true }))
app.use("/", express.static(__dirname + "/public/"))
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}
start()
