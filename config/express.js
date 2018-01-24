const bodyParser = require('body-parser')
const express = require('express')
const localStorageUpload = require('./localStorage')

module.exports = app => {
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH')
    next()
  })
  app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.status || 500).json(error.message || error)
  })

  app.use('/uploads', express.static('uploads'))
  const content = localStorageUpload.single('content')

  app.use('/posts', require('../src/routes/posts')(content))
  app.use('/users', require('../src/routes/users'))
}
