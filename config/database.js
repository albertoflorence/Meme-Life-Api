const mongoose = require('mongoose')
mongoose.connect('mongodb://admin:admin@ds111638.mlab.com:11638/webmeme')

module.exports = mongoose
