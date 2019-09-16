const User = require('../../models/user')
const { Unauthorized } = require('http-errors')

module.exports = async app => {
  app.addHook('onRequest', authHook)

  app.register(require('./playlists'), { prefix: '/playlists' })
}

const authHook = async request => {
  const payload = await request.jwtVerify()
  const user = await User.findById(payload.id)
  if (!user) {
    throw new Unauthorized('Invalid token')
  }

  request.user = user
}
