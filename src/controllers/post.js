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
      commentsCount: 0,
      likesCount: 0,
      disLikesCount: 0
    })

    post
      .save()
      .then(response => res.json(response))
      .catch(next)
  }

  const get = (req, res, next) => {
    const filter = req.query
    const userId = '5a6992517d27e016a8babffd'

    Post.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec()
      .then(posts => posts.map(liked(userId)))
      .then(posts => posts.map(setDate))
      .then(response => res.json(response))
      .catch(next)
  }

  const getDetail = (req, res, next) => {
    const { id } = req.params
    const userId = '5a6992517d27e016a8babffd'

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
      .lean()
      .exec()
      .then(liked(userId))
      .then(setDate)
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
      .then(post => {
        post.comments.push(comment._id)
        post.commentsCount += 1
        return post.save()
      })
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

const liked = user => doc => {
  if (!!doc.vote.positive.find(e => e.toString() === user)) {
    return {
      ...doc,
      liked: true
    }
  }
  if (!!doc.vote.negative.find(e => e.toString() === user)) {
    return {
      ...doc,
      disLiked: true
    }
  }
  return {
    ...doc,
    liked: false,
    disLiked: false
  }
}

const setDate = doc => ({
  ...doc,
  createdAt: formatTime(new Date() - new Date(doc.createdAt))
})

const formatTime = (time, i = 0) => {
  const arr = [1000, 60, 60, 24, 7, 4, 12]
  const names = [
    'millisecond',
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'mounth',
    'year'
  ]
  if (isNaN(i)) i = names.indexOf(i)

  const cur = arr[i]
  if (time >= cur && cur !== undefined) {
    return formatTime(time / cur, i + 1)
  }
  const rounded = Math.floor(time)
  const plural = rounded > 1 ? 's' : ''
  return rounded + ' ' + names[i] + plural + ' ago'
}
