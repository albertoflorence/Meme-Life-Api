const posts = require('express').Router()
const { Post, Comment } = require('../models')

posts.post('/create', (req, res) => {
  const { title, content_url, category, description, author } = req.body
  const post = new Post({
    title,
    content_url,
    category,
    description,
    author
  })

  post
    .save()
    .then(response => res.send(response))
    .catch(console.log)
})

posts.post('/comments', (req, res) => {
  const { author, body, postId } = req.body
  const comment = new Comment({
    author,
    body
  })

  Post.findById(postId)
    .then(post => post.comments.push(comment) && post.save())
    .then(response => res.send(response))
    .then(e => comment.save())
    .catch(console.log)
})

posts.get('/:id', (req, res) => {
  const { id } = req.params
  Post.findOne({ _id: id })
    .populate('author')
    .populate('comments')
    .exec()
    .then(response => res.send(response))
    .catch(console.log)
})

posts.get('/', (req, res) => {
  Post.find()
    .populate({
      path: 'author',
      select: 'avatar name _id'
    })
    .populate('comments')
    .exec()
    .then(response => res.send(response))
    .catch(console.log)
})

module.exports = posts
