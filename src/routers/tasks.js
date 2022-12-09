const express = require("express")
const router = new express.Router()
const Task = require("../model/task")
const auth = require("../middleware/auth")

//* create a new task
router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    })

    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

//* get (read) tasks of user
//? GET /tasks?completed=true
router.get("/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}
  const { completed } = req.query

  if (completed) {
    match.completed = completed === "true" ? true : false
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":")
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate()
    res.status(200).send(req.user.tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

//* get specific task by id
router.get("/tasks/:taskId", auth, async (req, res) => {
  const { taskId: _id } = req.params

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) return res.status(404).send()
    res.status(200).send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

//* update task by id
router.patch("/tasks/:taskId", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdate = ["completed", "desc"]
  const propNotExict = updates.filter((item) => !allowedUpdate.includes(item))
  const isValidOperation = updates.every((item) => allowedUpdate.includes(item))
  if (!isValidOperation) {
    return res
      .status(404)
      .send({ error: "Invalid updates", items_not_exict: propNotExict })
  }
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      owner: req.user._id,
    })

    if (!task) return res.status(404).send()

    updates.forEach((item) => (task[item] = req.body[item]))
    await task.save()

    res.status(200).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

//* delete task by id
router.delete("/tasks/:taskId", auth, async (req, res) => {
  const { taskId: _id } = req.params
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }
    res.status(200).send({ message: "Task deleted successfully", task })
  } catch (err) {
    res.status(500).send()
  }
})

module.exports = router
