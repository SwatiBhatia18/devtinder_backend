const express = require("express")
const bcrypt = require("bcrypt")
const profileRouter = express.Router()
const { useAuth } = require("../middleware/auth")
const { validateProfileData, validateNewPassword } = require("../utils/validation")

profileRouter.get("/profile/view", useAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

profileRouter.patch("/profile/edit", useAuth, async (req, res) => {
  try {
    const allFieldsValid = validateProfileData(req.body)
    if (!allFieldsValid) {
      throw new Error("Invalid profile data")
    }
    const loggedInUser = req.user

    //👉 req.user is not just a plain JavaScript object.
    // It’s a Mongoose document — a “live” object that is directly connected (linked) to your database record.

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

    await loggedInUser.save()

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

profileRouter.patch("/profile/password", useAuth, async (req, res) => {
  try {
    const { password } = req.body
    const isValid = await validateNewPassword(password, req.user)
    if (!isValid) throw new Error("Invalid password")
    const loggedInUser = req.user
    const encryptpassword = await bcrypt.hash(password, 10)
    loggedInUser.password = encryptpassword
    await loggedInUser.save()
    res.json({
      message: "Password updated successfully",
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = profileRouter
