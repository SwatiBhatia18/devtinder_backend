const express = require("express")
const requestsRouter = express.Router()
const { useAuth } = require("../middleware/auth")

requestsRouter.get("/sendConnectionRequest", useAuth, (req, res) => {
  try {
    const { user } = req
    res.send(user)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = requestsRouter
