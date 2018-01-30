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
      commentsCount: Number,
      likesCount: Number,
      dislikesCount: Number,
      comments: [{ type: ObjectId, ref: 'Comment' }],
      vote: {
        positive: [{ type: ObjectId, ref: 'User' }],
        negative: [{ type: ObjectId, ref: 'User' }]
      }
    },
    {
      timestamps: { createdAt: 'createdAt' },
      toObject: {
        virtuals: true
      },
      toJSON: {
        virtuals: true
      }
    }
  )

  postSchema.pre('find', autoPopulateAuthor).pre('findOne', autoPopulateAuthor)

  postSchema.methods.like = like
  postSchema.methods.disLike = disLike
  postSchema.methods.liked = liked
  postSchema.methods.getLikeInfo = getLikeInfo

  return postSchema
}

const autoPopulateAuthor = function(next) {
  this.populate('author', 'name avatar _id')
  next()
}

function like(user) {
  const currentState = this.liked(user)
  if (currentState === 'liked') {
    this.vote.positive.pull(user)
    this.likesCount -= 1
    return
  }

  if (currentState === 'disliked') {
    this.vote.negative.pull(user)
    this.dislikesCount -= 1
  }

  this.vote.positive.push(user)
  this.likesCount += 1
}

function disLike(user) {
  const currentState = this.liked(user)
  if (currentState === 'disliked') {
    this.vote.negative.pull(user)
    this.dislikesCount -= 1
    return
  }

  if (currentState === 'disliked') {
    this.vote.positive.pull(user)
    this.likesCount -= 1
  }

  this.vote.negative.push(user)
  this.dislikesCount += 1
}

const liked = function(userId) {
  let user = userId
  if (typeof user === 'object') {
    user = userId.toString()
  }
  if (!!~this.vote.positive.findIndex(e => e.toString() === user)) {
    return 'liked'
  }
  if (!!~this.vote.negative.findIndex(e => e.toString() === user)) {
    return 'disliked'
  }

  return false
}

const getLikeInfo = function(user) {
  const liked = this.liked(user)
  return {
    likesCount: this.likesCount,
    dislikesCount: this.dislikesCount,
    liked: liked === 'liked',
    disliked: liked === 'disliked'
  }
}
