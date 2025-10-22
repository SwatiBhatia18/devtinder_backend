const jwt = require("jsonwebtoken")
const User = require("../models/user")

const useAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      throw new Error("Token Expired !!")
    }
    const decryptedData = jwt.verify(token, "devTinder@12345")
    const userId = decryptedData?._id
    if (!userId) {
      throw new Error("Token Expired !!!!")
    }
    const user = await User.findById(userId)
    req.user = user
    next()
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
}

module.exports = {
  useAuth,
}
