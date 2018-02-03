const posts = require('express').Router()
const isAuthenticated = require('./isAuthenticated')
const { Post, Comment } = require('../models')
const { get, getDetail, create, addComment, likePost } = require('../controllers/post')({
  Post,
  Comment
})
module.exports = (fileHandler, cloudStorage) => {
  posts.get('/', get)
  posts.get('/:id', getDetail)
  posts.post('/', isAuthenticated, fileHandler, cloudStorage, create)
  posts.post('/comments', isAuthenticated, addComment)
  posts.post('/like', isAuthenticated, likePost)

  return posts
}
