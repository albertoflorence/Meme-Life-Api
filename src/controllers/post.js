module.exports = ({ Post, Comment }) => {
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
    const userId = '5a6992517d27e016a8babffd'

    Post.findOne({ _id: id })
      .populate('isLiked')
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
      .then(post => ({
        ...post.toObject(),
        commentCount: post.comments.length,
        liked: post.liked(userId),
        likeCount: post.likeCount()
      }))
      .then(post => res.json(post))
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

    Post.findById(postId)
      .then(post => {
        post.like(userId)
        return post.save()
      })
      .then(post => res.json(post))
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
