const express = require("express")
const app = express()

app.use((err, req, res, next) => {
  console.error(err.stack)
  if (err) res.status(500).send("Something broke using err !")
})

app.get("/getAllUser", (req, res, next) => {
    throw new Error("Some error occurred while fetching users")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
