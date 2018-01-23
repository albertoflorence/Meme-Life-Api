module.exports = Schema => {
  const { ObjectId } = Schema

  const postSchema = new Schema(
    {
      id: ObjectId,
      title: String,
      content_url: String,
      created_at: Date,
      category: String,
      description: String,
      author: { type: ObjectId, ref: 'User' },
      comments: [{ type: ObjectId, ref: 'Comment' }]
    },
    { timestamps: { createdAt: 'created_at' } }
  )

  return postSchema
}
