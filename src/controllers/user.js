module.exports = ({ User }) => {
  const signUp = (req, res, next) => {
    const { avatar, name, email, password } = req.body
    const newUser = new User({
      avatar,
      name,
      email,
      password
    })
    const token = 'blabla'

    newUser
      .save()
      .then(user => res.send({ token, user }))
      .catch(next)
  }

  const signIn = (req, res, next) => {
    const { email, password } = req.body
    const token = 'blabla'
    User.findOne({ email, password }).then(
      user =>
        user
          ? res.send({ user, token })
          : next({ status: 404, message: 'Verify your credentials' })
    )
  }

  return {
    signIn,
    signUp
  }
}
