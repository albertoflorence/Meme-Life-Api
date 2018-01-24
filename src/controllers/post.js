module.exports = ({ Post, Comment }) => {
  const create = (req, res, next) => {
    const { title, category, description, content } = req.body

    const author = '5a68e9e5ee2f4529e4c9a0ab'
    const host = req.protocol + '://' + req.headers.host
    const content_url = req.file
      ? host + '/' + req.file.path.replace('\\', '/')
      : content

    const post = new Post({
      title,
      content_url,
      category,
      description,
      author
    })

    post
      .save()
      .then(response => res.json(response))
      .catch(next)
  }

  const get = (req, res, next) => {
    Post.find()
      .populate({
        path: 'author',
        select: 'avatar name _id'
      })
      .populate('comments')
      .exec()
      .then(response => res.json(response))
      .catch(next)
  }

  const getDetail = (req, res, next) => {
    const { id } = req.params
    Post.findOne({ _id: id })
      .populate('author')
      .populate('comments')
      .exec()
      .then(response => res.json(response))
      .catch(next)
  }

  const addComment = (req, res, next) => {
    const { author, body, postId } = req.body
    const comment = new Comment({
      author,
      body
    })

    Post.findById(postId)
      .then(post => post.comments.push(comment) && post.save())
      .then(response => res.json(response))
      .then(e => comment.save())
      .catch(next)
  }

  return {
    get,
    getDetail,
    create,
    addComment
  }
}
