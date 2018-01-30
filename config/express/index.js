const bodyParser = require('body-parser')
const express = require('express')
const localStorageUpload = require('./localStorage')
const passport = require('passport')

module.exports = app => {
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH')
    next()
  })

  require('./authentication')
  app.use((req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      if (!err && user) {
        req.user = user
      }
      return next()
    })(req, res, next)
  })

  app.use('/uploads', express.static('uploads'))
  const content = localStorageUpload.single('content')

  app.use('/posts', require('../../src/routes/posts')(content))
  app.use('/users', require('../../src/routes/users'))
  app.use('/comments', require('../../src/routes/comments'))

  app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.status || 500).json(error.message || error)
  })
}
