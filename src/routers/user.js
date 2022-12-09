const express = require("express")
const User = require("../model/user")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")
const sharp = require("sharp")
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account")

const router = new express.Router()

//* create a new user (sign up )
router.post("/users", async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send(err)
  }
})

//* loggin user (sign in)
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findByCredentials(email, password)

    const token = await user.generateAuthToken()

    res.status(200).send({ user: user, token })
  } catch (err) {
    res.status(400).send(err)
  }
})

//* logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((item) => item.token !== req.token)
    await req.user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

//* read profile user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
})

//* logout all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

//* update user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body) // return array
  const allowedUpdate = ["name", "email", "password", "age"]
  const propNotExict = updates.filter((item) => !allowedUpdate.includes(item))
  const isValidOperation = updates.every((item) => allowedUpdate.includes(item))

  if (!isValidOperation)
    return res
      .status(404)
      .send({ error: "Invalid updates", items_not_exict: propNotExict })

  try {
    const user = await User.findById(req.user._id)

    updates.forEach((item) => (user[item] = req.body[item]))
    await user.save()
    res.status(200).send(user)
  } catch (err) {
    res.status(404).send(err)
  }
})

//* delete user account
router.delete("/users/me", auth, async (req, res) => {
  try {
    const { email, name } = req.user
    sendCancelationEmail(email, name)
    await req.user.remove()

    res
      .status(200)
      .send({ message: "User Deleted successfully", user_deleted: req.user })
  } catch (err) {
    res.status(400).send({ msg: "user not found", err })
  }
})

//? setup multer middleware for upload files in this case images
const upload = multer({
  limits: {
    fileSize: 5000000, //* 5 M.B
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|gif|jpeg)$/)) {
      return cb(
        new Error("Invalid extension, Please provide only images"),
        null
      )
    }
    cb(null, true)
  },
})

//* * * * * * * * * * * * * * * * *
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send({
      message: "image upload successfully",
    })
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message })
  }
)

//* Delete image uploaded router
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send({ msg: "Image deleted successfully" })
})

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
      // res.send({ msg: "image not found", avatar: user.avatar, user })
    }

    res.set("Content-Type", "image/png")
    res.send(user.avatar)
  } catch (err) {
    res.status(404).send()
  }
})
module.exports = router

//* this const storage only exists for reference purposes we don't need it for our app , we need it when we want to store real data img pdf or something and add it to upload object with property name storage , but in our case we store data as binary data in database
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../public/avatars/"))
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname))
//   },
// })
