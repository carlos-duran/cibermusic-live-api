const User = require('../../models/user')
const { Unauthorized } = require('http-errors')
const axios = require('axios')

module.exports = async app => {
  app.addHook('onRequest', authHook)

  app.get('/user', user)
  app.put('/perfil', update)
  app.get('/search', search)
  app.get('/home-music', homeMusic)
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

async function user(request) {
  return request.user
}

const update = {
  schema: {
    body: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthdate', 'country'],
      properties: {
        firstName: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        lastName: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        birthdate: {
          type: 'string',
          format: 'date'
        },
        country: {
          type: 'string',
          maxLength: 50
        }
      }
    }
  },
  async handler(request) {
    return User.update(
      {
        _id: request.user._id
      },
      {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        birthdate: request.body.birthdate,
        country: request.body.country
      }
    )
  }
}

async function search(request) {
  const baseUrl = 'https://api.deezer.com/search'
  const { data } = await axios.get(baseUrl, { params: { q: request.query.q } })
  return data
}

async function homeMusic() {
  return {
    topTracks: await topTracks(),
    topPlaylists: await topPlaylists(),
    selectedPlaylists: await selectedPlaylists()
  }
}

async function topTracks(request) {
  const url = 'https://api.deezer.com/chart/0/tracks'
  const { data } = (await axios.get(url)).data
  return data
}

async function topPlaylists() {
  const urlTopPlaylists = 'https://api.deezer.com/chart/0/playlists?limit=5'
  const { data: topPlaylists } = (await axios.get(urlTopPlaylists)).data
  for (const playlist of topPlaylists) {
    const { data: tracklist } = (await axios.get(playlist.tracklist)).data
    playlist.tracks = tracklist
  }
  return topPlaylists
}

async function selectedPlaylists(request) {
  const urls = [
    'https://api.deezer.com/playlist/1306931615', // Best Rock of All Time
    'https://api.deezer.com/playlist/1180358611' // Rock Love Songs
  ]
  const responses = await Promise.all(urls.map(url => axios.get(url)))
  return responses.map(r => r.data)
}
