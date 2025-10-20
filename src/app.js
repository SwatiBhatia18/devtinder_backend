const express = require("express")
const app = express()

const { adminAuthenticator, userAuthenticator } = require("./utils/middlewares")

app.use("/admin", adminAuthenticator)
// so for all admin routes , first it will go into this middleware and then only move to all other routes as code moves in sequence

app.get("/admin/getAllAdmin", (req, res, next) => {
  res.send("Get All Admin handler")
})

app.delete("/admin/deleteAdmin", (req, res, next) => {
  res.send("Delete Admin handler")
})

app.get("/user", userAuthenticator, (req, res, next) => {
  res.send("Get User handler")
})

app.get("/user/login", (req, res, next) => {
  // now as here the authenticator is not needed so we didnt use it on global level using use "/"
  res.send("Get User Login handler")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
