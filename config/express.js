const bodyParser = require('body-parser')

module.exports = app => {
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH')
    next()
  })

  app.use('/posts', require('../src/routes/posts'))
  app.use('/users', require('../src/routes/users'))
}
