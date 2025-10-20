const express = require("express")
const app = express()

// only for this particular route /user
app.get('/user', (req, res, next) => {
  console.log(req.params, req.query)
  res.send("First handler for /user")
  next()
}, (req, res, next)=>{
    res.send("Second handler for /user")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777")
})
