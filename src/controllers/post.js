const PAGE_LIMIT = 5
module.exports = ({ Post, Comment }) => {
  const create = (req, res, next) => {
    const { title, category, description, content } = req.body

    const author = req.user._id

    const host = 'https://' + req.headers.host
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
    const { page = 1, ...filter } = req.query
    const userId = req.user && req.user._id
    const skip = parseInt(page - 1) * PAGE_LIMIT
    const maxPages = Post.find(filter)
      .count()
      .then(count => Math.ceil(count / PAGE_LIMIT))

    const docs = Post.find(filter)
      .select('-comments')
      .sort({ createdAt: -1 })
      .limit(PAGE_LIMIT)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean()
      .then(posts => posts.map(liked(userId)))

    Promise.all([maxPages, docs])
      .then(([pages, response]) =>
        res.json({
          pages,
          response
        })
      )
      .catch(next)
  }

  const getDetail = (req, res, next) => {
    const { id } = req.params
    const userId = req.user && req.user._id

    Post.findOne({ _id: id })
      .lean()
      .exec()
      .then(liked(userId))
      .then(post => res.json(post))
      .catch(next)
  }

  const addComment = (req, res, next) => {
    const { body, postId } = req.body

    const author = req.user._id

    Post.findById(postId)
      .then(post => {
        const comment = new Comment({
          postId,
          body,
          author,
          repliesCount: 0,
          replies: []
        })

        post.commentsCount += 1
        post.save()
        return comment.save()
      })
      .then(comment => res.send(comment))
      .catch(next)
  }

  const likePost = (req, res, next) => {
    const { postId } = req.body
    const userId = req.user._id

    Post.findById(postId)
      .then(post => {
        post.like(userId)
        return post.save()
      })
      .then(post => res.json(post.getLikeInfo(userId)))
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

const liked = userId => ({ vote, ...doc }) => {
  let user = userId
  if (typeof user === 'object') {
    user = userId.toString()
  }
  if (!!vote.positive.find(ids => ids.toString() === user)) {
    return {
      ...doc,
      liked: true
    }
  }
  if (!!vote.negative.find(ids => ids.toString() === user)) {
    return {
      ...doc,
      disliked: true
    }
  }
  return {
    ...doc,
    liked: false,
    disliked: false
  }
}
