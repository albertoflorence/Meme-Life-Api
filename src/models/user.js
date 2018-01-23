module.exports = Schema => {
  const userSchema = new Schema({
    name: String,
    avatar: String,
    email: String,
    password: String
  })

  return userSchema
}
