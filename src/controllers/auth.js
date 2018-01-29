const jwt = require('jsonwebtoken')

module.exports = ({ User }) => {
  const signUp = (req, res, next) => {
    const { avatar, name, email, password } = req.body
    const newUser = new User({
      avatar,
      name,
      email,
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
    const token = 'blabla'
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

  return {
    signIn,
    signUp
  }
}
