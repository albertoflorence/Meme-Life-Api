const posts = require('express').Router()
const isAuthenticated = require('./isAuthenticated')
const { Post, Comment } = require('../models')
const {
  get,
  getDetail,
  create,
  addComment,
  likePost
} = require('../controllers/post')({
  Post,
  Comment
})
module.exports = fileHandler => {
  posts.get('/', get)
  posts.get('/:id', getDetail)
  posts.post('/', isAuthenticated, fileHandler, create)
  posts.post('/comments', isAuthenticated, addComment)
  posts.post('/like', isAuthenticated, likePost)

  return posts
}
