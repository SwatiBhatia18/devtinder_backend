const adminAuthenticator =  (req, res, next) => {
  const token = 123
  const isAuthenticate = token === 123
  if (!isAuthenticate) {
    res.status(401).send("Unauthorized User")
  } else {
    next()
  }
}

const userAuthenticator =  (req, res, next) => {
  const token = 32
  const isAuthenticate = token === 123
  if (!isAuthenticate) {
    res.status(401).send("Unauthorized User")
  } else {
    next()
  }
}

module.exports = {
  adminAuthenticator,
  userAuthenticator
}