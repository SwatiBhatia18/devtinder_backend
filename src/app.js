const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Vanshika",
    lastName: "Bhatia",
    email: "vani@example.com",
    password: "password123",
    age: 27,
    gender: "Female",
  })
  try {
    await user.save()
    res.send("User saved successfully")
  } catch (err) {
    res.status(400).send("Error saving user" + err.message)
  }
})

connectDB()
  .then(() => {
    console.log("Database connected successfully")
    app.listen(7777, () => {
      console.log("Server is running on port 7777")
    })
  })
  .catch((err) => {
    console.log("Database connection failed", err)
  })
