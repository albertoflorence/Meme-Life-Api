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
      likeCount: Number
    },
    { timestamps: { createdAt: 'createdAt' } }
  )

  const autoPopulateAuthor = function(next) {
    this.populate('author', 'name avatar _id')
    next()
  }
  postSchema.pre('find', autoPopulateAuthor).pre('findOne', autoPopulateAuthor)

  return postSchema
}
