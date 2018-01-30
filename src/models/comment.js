module.exports = Schema => {
  const { ObjectId } = Schema

  const commentSchema = new Schema(
    {
      author: { type: ObjectId, ref: 'User' },
      postId: { type: ObjectId, index: true, ref: 'Post' },
      body: String,
      repliesCount: Number,
      replies: [{ type: ObjectId, ref: 'Comment' }]
    },
    { timestamps: { createdAt: 'createdAt' } }
  )

  return commentSchema
}
