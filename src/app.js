const express = require("express")
const app = express()

app.get("/admin/getAllAdmin", (req, res, next) => {
  console.log("Inside first admin route")
  next()
})

app.get("/admin/getAllAdmin", (req, res, next) => {
  console.log("Inside second admin route")
  res.send("second admin route")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
