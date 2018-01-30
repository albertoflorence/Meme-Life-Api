const mongoose = require('mongoose')
const { DB_URI } = require('./SECRETS')
mongoose.connect(DB_URI)

module.exports = mongoose
