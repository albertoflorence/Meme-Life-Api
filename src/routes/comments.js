const comments = require('express').Router()
const isAuthenticated = require('./isAuthenticated')
const { Comment } = require('../models')
const { replyComment, getDetail, get } = require('../controllers/comment')({
  Comment
})

comments.post('/reply', isAuthenticated, replyComment)
comments.get('/:id', getDetail)
comments.get('/', get)

module.exports = comments