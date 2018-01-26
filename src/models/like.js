module.exports = Schema => {
  const { ObjectId } = Schema

  const likeSchema = new Schema({
    userId: { type: ObjectId, ref: 'User' },
    postId: { type: ObjectId, ref: 'Post' },
    liked: Boolean
  })

  return likeSchema
}
