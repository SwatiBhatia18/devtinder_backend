const express = require("express")
const app = express()

app.use('/test', (req,res)=>{
    res.send("Hello From Server /test")
})

app.listen(7777, ()=>{
    console.log("Server is running on port 7777")
})
