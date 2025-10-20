const express = require("express")
const app = express()

app.get("/getAllUser", (req, res, next) => {
  throw new Error("Some error occurred while fetching users")
  res.send("List of all users")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  if(err)
  res.status(500).send("Something broke!")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
