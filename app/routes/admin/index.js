const User = require('../../models/user')
const { Unauthorized, Forbidden } = require('http-errors')

module.exports = async app => {
  app.addHook('onRequest', authHook)

  app.register(require('./users'), { prefix: '/users' })
}

const authHook = async request => {
  const payload = await request.jwtVerify()
  const user = await User.findById(payload.id)
  if (!user) {
    throw new Unauthorized()
  }
  if (!user.admin) {
    throw new Forbidden()
  }

  request.user = user
}
