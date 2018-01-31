const users = require('express').Router()
const { User } = require('../models')
const { signIn, signUp, signInWithToken } = require('../controllers/auth')({
  User
})
users.post('/signin', signIn)
users.post('/signin/token', signInWithToken)
users.post('/signup', signUp)

module.exports = users
