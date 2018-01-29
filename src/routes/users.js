const users = require('express').Router()
const { User } = require('../models')
const { signIn, signUp } = require('../controllers/auth')({
  User
})
users.post('/signIn', signIn)
users.post('/signup', signUp)

module.exports = users
