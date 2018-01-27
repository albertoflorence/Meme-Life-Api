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
      disLikesCount: Number,
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
  postSchema.methods.metaData = metaData

  postSchema.virtual('tesAAAAAAAAAAAAAAAAAAAAAt').get(function() {
    return 'hmAAAAAAAAAAAAAAAAAm'
  })

  return postSchema
}

const metaData = user => ({
  commentCount: this.comments.length,
  liked: this.liked(user),
  likeCount: this.likeCocunt()
})

const autoPopulateAuthor = function(next) {
  this.populate('author', 'name avatar _id')
  next()
}

function like(user) {
  const currentState = this.liked(user)
  if (currentState === 'like') {
    this.vote.positive.pull(user)
    this.likesCount -= 1
    return
  }

  if (currentState === 'disLike') {
    this.vote.negative.pull(user)
    this.disLikesCount -= 1
  }

  this.vote.positive.push(user)
  this.likesCount += 1
}

function disLike(user) {
  const currentState = this.liked(user)
  if (currentState === 'disLike') {
    this.vote.negative.pull(user)
    this.disLikesCount -= 1
    return
  }

  if (currentState === 'disLike') {
    this.vote.positive.pull(user)
    this.likesCount -= 1
  }

  this.vote.negative.push(user)
  this.disLikesCount += 1
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
