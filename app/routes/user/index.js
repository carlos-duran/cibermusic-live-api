const User = require('../../models/user')
const { Unauthorized } = require('http-errors')
const axios = require('axios')

module.exports = async app => {
  app.addHook('onRequest', authHook)

  app.get('/search', search)
  app.register(require('./home'))
  app.register(require('./account'), { prefix: '/user' })
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

async function search(request) {
  const baseUrl = 'https://api.deezer.com/search'
  const { data } = await axios.get(baseUrl, { params: { q: request.query.q } })
  return data
}
