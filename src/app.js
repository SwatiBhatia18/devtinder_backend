const express = require("express")
const app = express()

// only for this particular route /user
app.get("/user", (req, res) => {
  res.send({
    firstName: "Swati",
    lastName: "Bhatia",
  })
})

app.post("/user", (req, res) => {
  // ADDED TO DATABSE
  res.send("Successfully Added User")
})

app.delete("/user", (req, res) => {
  // REMOVED FROM DATABASE
  res.send("Successfully Deleted User")
})

app.patch("/user", (req, res) => {
  // UPDATED IN DATABASE
  res.send("Successfully Updated User")
})

// can be used for all the methods(GET, POST, DELETE, PATCH, etc.) for a particular route and any route that starts with /user/anything
app.use("/user", (req, res) => {
  res.send("Hello From Server /user")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
