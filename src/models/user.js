const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"], // mandatory
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [100, "First name cannot exceed 100 characters"],
      match: [/^[A-Za-z\s]+$/, "First name must contain only alphabets"],
      trim: true, // removes extra spaces
    },
    lastName: {
      type: String,
      match: [/^[A-Za-z\s]+$/, "Last name must contain only alphabets"],
      trim: true,
    },
    about: {
      type: String,
      maxlength: [500, "About section cannot exceed 500 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // ensures no duplicate email in DB
      lowercase: true, // converts automatically to lowercase
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format")
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Weak password - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10"
          )
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://example.com/default-profile-pic.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for photoUrl")
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old"],
      max: [65, "Age cannot exceed 65"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 10
        },
        message: "A user can have at most 10 skills",
      },
    },
  },
  { timestamps: true }
)

// methods linked with user 

userSchema.methods.getJWT = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, "devTinder@12345", {
    expiresIn: "7d", // expires in 7 days
  })
  return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this
  const passwordHash = user.password
  const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash)
  return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)
