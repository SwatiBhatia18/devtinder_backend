const express = require("express")
const app = express()

// only for this particular route /user
app.get(
  "/user",
  (req, res, next) => {
    console.log("First handler for /user")
    next()
    console.log("First handler for after next")
    res.send("First handler for /user")
  },
  (req, res, next) => {
    console.log("Second handler for /user")
    res.send("Second handler for /user")
  }
)

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
