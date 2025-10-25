const express = require("express")
const bcrypt = require("bcrypt")

const authRouter = express.Router()
const { validateSignUpData } = require("../utils/validation")

const User = require("../models/user")
const saltRounds = 10

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req.body)
    // encryption of password
    const { password, firstName, lastName, email } = req.body
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    })
    await user.save()
    res.send("User saved successfully")
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error("Invalid credentials")
    }
    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      const token = await user.getJWT()
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        secure: true, // 👈 you expect this to enforce HTTPS-only cookies
        httpOnly: true, // 👈 prevents JS access
        // If you’re testing on localhost (HTTP), browsers make an exception for development convenience.
      })
      res.send(user)
    } else {
      throw new Error("Invalid credentials")
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  })
  res.send("Logout successful")
})

module.exports = authRouter
