const express = require("express")
const app = express()

app.get("/getAllUser", (req, res, next) => {
  try {
    throw new Error("Some error occurred while fetching users")
    res.send("List of all users")
  } catch (err) {
    res.status(500).send("Something broke!")
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  if (err) res.status(500).send("Something broke using err !")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
