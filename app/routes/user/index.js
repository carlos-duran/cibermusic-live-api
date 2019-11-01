const User = require('../../models/user')
const { Unauthorized } = require('http-errors')
const axios = require('axios')

module.exports = async app => {
  app.addHook('onRequest', authHook)

  app.get('/user', user)
  app.get('/search', search)
  app.get('/selected-playlists', selectedPlaylists)
  app.get('/selected-artists', selectedArtists)
  app.get('/selected-toptracks', selectedTopTracks)
  app.get('/top-playlists', topPlaylists)
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

async function search(request) {
  const baseUrl = 'https://api.deezer.com/search'
  const { data } = await axios.get(baseUrl, { params: { q: request.query.q } })
  return data
}

async function selectedPlaylists(request) {
  const urls = [
    'https://api.deezer.com/playlist/1306931615', // Best Rock of All Time
    'https://api.deezer.com/playlist/1180358611' // Rock Love Songs
  ]
  const responses = await Promise.all(urls.map(url => axios.get(url)))
  return responses.map(r => r.data)
}

async function selectedTopTracks(request) {
  const urls = 'https://api.deezer.com/chart/0/tracks'
  const { data } = await axios.get(urls)
  return data
}

async function selectedArtists(request) {
  const urls = [
    'https://api.deezer.com/artist/8623006/top?limit=50', // Aimer
    'https://api.deezer.com/artist/4162/top?limit=50', // Mago de Oz
    'https://api.deezer.com/artist/469713/top?limit=50', // OOR
    'https://api.deezer.com/artist/133049/top?limit=50', // EV
    'https://api.deezer.com/artist/1188/top?limit=50' // Maroon 5
  ]
  const responses = await Promise.all(urls.map(url => axios.get(url)))
  return responses.map(r => r.data)
}

async function topPlaylists() {
  const urlTopPlaylists = 'https://api.deezer.com/chart/0/playlists?limit=5'
  const { data: topPlaylists } = (await axios.get(urlTopPlaylists)).data
  for (const playlist of topPlaylists) {
    const { data: tracklist } = (await axios.get(playlist.tracklist)).data
    playlist.data = tracklist
  }
  return topPlaylists
}
