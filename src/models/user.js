const jwt = require('jsonwebtoken')
const { JWT_SECRET, CRYPTO_SECRET } = require('../../config/SECRETS')
const crypto = require('crypto')

module.exports = Schema => {
  const userSchema = new Schema({
    name: String,
    avatar: String,
    email: String,
    password: { type: String, select: false }
  })

  userSchema.methods.getJwtToken = getJwtToken
  userSchema.statics.login = function({ email, password }) {
    const encryptPassword = passwordCrypt(password)
    return this.findOne({ email, password: encryptPassword })
  }

  userSchema.pre('save', function(next) {
    this.password = passwordCrypt(this.password)
    next()
  })
  return userSchema
}

function getJwtToken() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      avatar: this.avatar,
      name: this.name
    },
    JWT_SECRET,
    {
      expiresIn: '12h'
    }
  )
}

const passwordCrypt = password =>
  crypto
    .createHmac('sha256', CRYPTO_SECRET)
    .update(password)
    .digest('hex')
