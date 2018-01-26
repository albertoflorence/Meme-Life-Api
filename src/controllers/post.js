module.exports = ({ Post, Comment, Like }) => {
  const create = (req, res, next) => {
    const { title, category, description, content } = req.body

    const author = '5a698eb1ecbbb51c3c74a413'

    const host = req.protocol + '://' + req.headers.host
    const content_url = req.file
      ? host + '/' + req.file.path.replace('\\', '/')
      : content

    const post = new Post({
      title,
      content_url,
      category,
      description,
      author,
      likeCount: 0
    })

    post
      .save()
      .then(response => res.json(response))
      .catch(next)
  }

  const get = (req, res, next) => {
    const filter = req.query

    Post.find(filter)
      .sort({ createdAt: -1 })
      .exec()
      .then(response => res.json(response))
      .catch(next)
  }

  const getDetail = (req, res, next) => {
    const { id } = req.params
    Post.findOne({ _id: id })
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User',
          select: 'name avatar _id'
        }
      })
      .sort('-comments.createdAt')
      .exec()
      .then(response => res.json(response))
      .catch(next)
  }

  const addComment = (req, res, next) => {
    const { body, postId } = req.body

    const author = '5a6992517d27e016a8babffd'

    const comment = new Comment({
      author,
      body
    })

    Post.findById(postId)
      .then(post => post.comments.push(comment._id) && post.save())
      .then(response => res.json(response))
      .then(e => comment.save())
      .catch(next)
  }

  const likePost = (req, res, next) => {
    const { postId } = req.body
    const userId = '5a6992517d27e016a8babffd'

    Like.findOne({
      postId,
      userId
    })
      .then(like => {
        if (like) {
          like.liked = !like.liked
          return like
        }
        return new Like({ postId, userId, liked: true })
      })
      .then(like => like.save())
      .then(like => {
        const increment = like.liked ? +1 : -1
        return Post.findByIdAndUpdate(postId, {
          $inc: { likeCount: increment }
        })
      })
      .then(post => res.send(post))
      .catch(next)
  }

  return {
    get,
    getDetail,
    create,
    addComment,
    likePost
  }
}
