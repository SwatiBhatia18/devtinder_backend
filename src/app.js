const express = require("express")
const app = express()

// only for this particular route /user
app.get(
  "/user",
  [(req, res, next) => {
    console.log("First handler for /user")
    next()
    // res.send("First handler for /user")
  },
  (req, res, next) => {
    console.log("Second handler for /user")
    next()
  },
  (req, res, next) => {
    console.log("Third handler for /user")
    next()
  }],
  (req, res, next) => {
    console.log("Fourth handler for /user")
    res.send("Fourth handler for /user")
  }
)

// Calling next() when there are no more handlers is harmless. Express will just finish; nothing else happens. So your code runs, logs the four messages, sends the response, and exits cleanly.

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
