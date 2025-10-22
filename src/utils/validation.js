const validator = require("validator")

const validateSignUpData = (data) => {
  const { firstName, lastName, email, password } = data
  if (!firstName || !lastName) throw new Error("Invalid Name")
  else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format")
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please provide a strong password")
  }
}

module.exports = {validateSignUpData}
