const mongoose = require("mongoose")

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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // regex for email validation
    },

    // ✅ Password - strong password validation
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (v) {
          // Must have 1 uppercase, 1 lowercase, 1 number, 1 special character
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(v)
        },
        message:
          "Password must contain at least one uppercase, one lowercase, one number, and one special character",
      },
    },
    photoUrl: {
      type: String,
      default: "https://example.com/default-profile-pic.png",
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
