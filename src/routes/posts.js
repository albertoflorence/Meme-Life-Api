const posts = require('express').Router()
const { Post, Comment } = require('../models')
const { get, getDetail, create, addComment } = require('../controllers/post')({
  Post,
  Comment
})
module.exports = fileHandler => {
  posts.get('/', get)
  posts.get('/:id', getDetail)
  posts.post('/', fileHandler, create)
  posts.put('/comments', addComment)

  return posts
}
