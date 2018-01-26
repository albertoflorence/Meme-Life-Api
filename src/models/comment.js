module.exports = Schema => {
  const { ObjectId } = Schema

  const commentSchema = new Schema(
    {
      author: { type: ObjectId, ref: 'User' },
      body: String
    },
    { timestamps: { createdAt: 'createdAt' } }
  )

  return commentSchema
}
