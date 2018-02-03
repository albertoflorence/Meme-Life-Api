const bodyParser = require('body-parser')
const express = require('express')
const multer = require('./localStorage')
const passport = require('passport')
const cloudStorage = require('./cloudStorage')
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

  const fileHandler = multer.single('content')

  app.use('/posts', require('../../src/routes/posts')(fileHandler, cloudStorage))
  app.use('/users', require('../../src/routes/users'))
  app.use('/comments', require('../../src/routes/comments'))

  app.use((error, req, res, next) => {
    console.log('[ ----- ERROR -----]:', error)
    if (error.code === 11000) {
      const field = error.message.match(/\$\w+\_/)[0].slice(1, -1)
      return res.status(400).json({ message: field + ' already exist' })
    }
    res.status(error.status || 500).json(error)
  })
}
