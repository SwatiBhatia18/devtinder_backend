const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()

app.use(express.json()) // middleware to parse JSON bodies into JS objects and embed it in req.body

app.post("/signup", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.send("User saved successfully")
  } catch (err) {
    res.status(400).send("Error saving user " + err.message)
  }
})

app.get("/user", async (req, res) => {
  try {
    console.log(req.body.email)
    //  const users = await User.findById(req.body.id)
    const users = await User.find({
      email: req.body.email,
    })
    res.send(users)
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message)
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message)
  }
})

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id)
    res.send("User deleted successfully")
  } catch (err) {
    res.status(400).send("Error deleting user" + err.message)
  }
})

app.patch("/user", async (req, res) => {
  try {
    // const user = await User.findOneAndUpdate(
    //   { email: "vani@example.com" },
    //   req.body,
    //   { new: false }
    // )
    const ALLOWED_UPDATES = ["id", "password", "age", "skills"]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) =>
      ALLOWED_UPDATES.includes(update)
    )
    if (!isValidOperation) {
      throw new Error("Invalid updates!")
    }
    if(req.body.skills.length > 10){
      throw new Error("A user can have at most 10 skills")
    }
    const user = await User.findByIdAndUpdate(req.body.id, req.body, {
      new: false,
      runValidators: true,
    })
    console.log(user)
    res.send("User updated successfully")
  } catch (err) {
    res.status(400).send("Error updating user - " + err.message)
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
