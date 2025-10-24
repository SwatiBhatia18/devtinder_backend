const validator = require("validator")
const bcrypt = require("bcrypt")

const validateSignUpData = (data) => {
  const { firstName, lastName, email, password } = data
  if (!firstName || !lastName) throw new Error("Invalid Name")
  else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format")
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please provide a strong password")
  }
}

const validateProfileData = (data) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ]

  const isAllowed = Object.keys(data).every((field) =>
    allowedEditFields.includes(field)
  )

  return isAllowed
}

const validateNewPassword = async (newPassword, user) => {
    const isSame = await bcrypt.compare(newPassword, user.password)
    if (isSame || !validator.isStrongPassword(newPassword)) {
        return false
      }
    return true
}

module.exports = { validateSignUpData, validateProfileData, validateNewPassword }
