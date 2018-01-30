module.exports = ({ Comment }) => {
  const replyComment = (req, res, next) => {
    const { commentId, body } = req.body
    const author = req.user._id

    Comment.findById(commentId)
      .then(comment => {
        newComment = new Comment({ body, author })
        comment.replies.push(newComment._id)
        comment.repliesCount += 1
        comment.save()
        return newComment.save()
      })
      .then(response => res.json(response))
      .catch(next)
  }

  const get = (req, res, next) => {
    const filter = req.query
    const userId = req.user && req.user._id

    Comment.find(filter)
      .sort({ createdAt: -1 })
      .populate('author')
      .select('-replies')
      .lean()
      .then(response => res.json(response))
      .catch(next)
  }

  const getDetail = (req, res, next) => {
    const { id } = req.params
    const userId = req.user && req.user._id

    Comment.findById(id)
      .populate('author')
      .populate({
        path: 'replies',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .lean()
      .then(response => res.send(response))
      .catch(next)
  }

  return {
    replyComment,
    get,
    getDetail
  }
}
