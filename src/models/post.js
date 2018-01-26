module.exports = Schema => {
  const { ObjectId } = Schema

  const postSchema = new Schema(
    {
      id: ObjectId,
      title: String,
      content_url: String,
      category: String,
      description: String,
      author: { type: ObjectId, ref: 'User' },
      comments: [{ type: ObjectId, ref: 'Comment' }],
      vote: {
        positive: [{ type: ObjectId, ref: 'User' }],
        negative: [{ type: ObjectId, ref: 'User' }]
      }
    },
    { timestamps: { createdAt: 'createdAt' } }
  )

  postSchema.pre('find', autoPopulateAuthor).pre('findOne', autoPopulateAuthor)
  postSchema.methods.like = like
  postSchema.methods.disLike = disLike
  postSchema.methods.liked = liked
  postSchema.methods.likeCount = likeCount
  postSchema.methods.disLikeCount = disLikeCount

  return postSchema
}

const autoPopulateAuthor = function(next) {
  this.populate('author', 'name avatar _id')
  next()
}

function like(user) {
  this.vote.negative.pull(user)

  if (!!~this.vote.positive.indexOf(user)) {
    return this.vote.positive.pull(user)
  }

  this.vote.positive.addToSet(user)
}

function disLike(user) {
  this.vote.positive.pull(user)

  if (!!~this.vote.negative.indexOf(user)) {
    return this.vote.negative.pull(user)
  }
  this.vote.negative.addToSet(user)
}

const liked = function(user) {
  if (!!~this.vote.positive.indexOf(user)) {
    return 'like'
  }
  if (!!~this.vote.negative.indexOf(user)) {
    return 'disLiked'
  }

  return false
}

const likeCount = function(user) {
  return this.vote.positive.length
}

const disLikeCount = function(user) {
  return this.vote.negative.length
}
