const express = require("express")
const profileRouter = express.Router()
const { useAuth } = require("../middleware/auth")

profileRouter.get("/profile", useAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = profileRouter