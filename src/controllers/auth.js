const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/SECRETS')

module.exports = ({ User }) => {
  const signUp = (req, res, next) => {
    const { avatar, name, email, password } = req.body
    const newUser = new User({
      avatar,
      name,
      email: email.toLowerCase(),
      password
    })
    newUser
      .save()
      .then(user => {
        const token = user.getJwtToken()
        res.send({ token, user })
      })
      .catch(next)
  }

  const signIn = (req, res, next) => {
    const { email, password } = req.body
    User.login({ email, password })
      .then(user => {
        if (!user) {
          return next({ status: 404, message: 'Verify your credentials' })
        }
        const token = user.getJwtToken()
        res.send({ user, token })
      })
      .catch(next)
  }

  const signInWithToken = (req, res, next) => {
    const { token } = req.body
    jwt.verify(token, JWT_SECRET, (err, response) => {
      if (err) return next({ status: 400, message: 'invalid token' })
      if (!response) return res.json(null)
      User.findById(response._id)
        .then(user => {
          if (!user) return res.json(null)
          const newToken = user.getJwtToken()
          res.send({
            user,
            token
          })
        })
        .catch(next)
    })
  }

  return {
    signIn,
    signUp,
    signInWithToken
  }
}
