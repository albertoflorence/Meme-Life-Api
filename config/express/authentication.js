const { Strategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
const { User } = require('../../src/models')
const { JWT_SECRET } = require('../SECRETS')

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}

passport.use(
  new Strategy(opts, (jwt_payload, done) =>
    User.findById(jwt_payload._id)
      .then(user => (user ? done(null, user) : done(null, false)))
      .catch(err => done(err, false))
  )
)
