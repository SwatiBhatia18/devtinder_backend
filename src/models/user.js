const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    // ✅ First Name - must be at least 2 chars, only alphabets allowed
    firstName: {
      type: String,
      required: [true, "First name is required"], // mandatory
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [100, "First name cannot exceed 100 characters"],
      match: [/^[A-Za-z\s]+$/, "First name must contain only alphabets"],
      trim: true, // removes extra spaces
    },
    // ✅ Last Name - optional, alphabets only
    lastName: {
      type: String,
      match: [/^[A-Za-z\s]+$/, "Last name must contain only alphabets"],
      trim: true,
    },

    // ✅ Email - must be valid, unique, lowercase
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

    // ✅ Password - strong password validation
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
    // ✅ Age - must be between 18 and 65
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old"],
      max: [65, "Age cannot exceed 65"],
    },
    // ✅ Gender - only allowed values
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
    },
    // ✅ Skills - must be an array of strings, max 10 skills allowed
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 10
        },
        message: "A user can have at most 10 skills",
      },
    },

    // ✅ Optional: Role field for access control
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
  },

  // ✅ Automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
