const posts = require('express').Router()
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
  posts.post('/', fileHandler, create)
  posts.post('/comments', addComment)
  posts.post('/like', likePost)

  return posts
}
