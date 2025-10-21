const mongoose = require("mongoose")

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://swatibhatia626_db_user:GhS39S6zVm1WikA6@cluster0.kxgnxk8.mongodb.net/"
  )
}

module.exports = connectDB
