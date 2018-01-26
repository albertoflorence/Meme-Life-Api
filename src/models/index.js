const moongose = require('../../config/database')
const { Schema } = moongose

module.exports.User = moongose.model('User', require('./user')(Schema))
module.exports.Comment = moongose.model('Comment', require('./comment')(Schema))
module.exports.Post = moongose.model('Post', require('./post')(Schema))
module.exports.Like = moongose.model('Like', require('./like')(Schema))
