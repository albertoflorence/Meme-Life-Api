const users = require('express').Router()
const { User } = require('../models')

users.post('/signup', (req, res) => {
  const { avatar, name, email, password } = req.body
  const user = new User({
    avatar,
    name,
    email,
    password
  })

  user
    .save()
    .then(response => res.send(response))
    .catch(console.log)
})

module.exports = users
