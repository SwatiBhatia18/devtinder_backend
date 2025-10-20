const express = require("express")
const app = express()

app.use("/admin", (req, res, next) => {
  const token = 123
  const isAuthenticate = token === 123
  if (!isAuthenticate) {
    res.status(401).send("Unauthorized User")
  } else {
    next()
  }
})

app.get("/admin/getAllAdmin", (req, res, next) => {
  res.send("Get All Admin handler")
})

app.get("/admin/deleteAdmin", (req, res, next) => {
  res.send("Delete Admin handler")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
