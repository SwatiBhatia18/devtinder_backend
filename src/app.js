const express = require("express")
const app = express()

app.get("/getAllUser", (req, res, next) => {
  throw new Error("Some error occurred while fetching users")
})

app.use("/", (err, req, res, next) => {
  if (err) res.status(500).send("Something broke using err !")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
