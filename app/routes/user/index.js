const User = require('../../models/user')
const { Unauthorized } = require('http-errors')
const axios = require('axios')

module.exports = async app => {
  app.addHook('onRequest', authHook)

  app.get('/user', user)
  app.get('/search', search)
  app.get('/selected-playlists', selectedPlaylists)
  app.get('/selected-artists', selectedArtists)
  app.get('/selected-top', selectedTop)
  app.get('/selected-topname', selectedTopName)
  app.get('/selected-toplist', selectedTopList)
  app.get('/selected-toptracks', selectedTopTracks)
  app.get('/api', PlaylistName)
  app.get('/prueba', prueba)
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

async function selectedTop(request) {
  const urls = 'https://api.deezer.com/chart/0/playlists?limit=5'
  const { data } = await axios.get(urls)
  return data
}
async function selectedTopTracks(request) {
  const urls = 'https://api.deezer.com/chart/0/tracks'
  const { data } = await axios.get(urls)
  return data
}
async function selectedTopList(request) {
  const urls = await UrlApi()
  const responses = await Promise.all(urls.map(url => axios.get(url)))
  return responses.map(r => r.data)
}

async function selectedTopName(request) {
  const urls = 'playlists'

  const { data } = await axios.get('https://api.deezer.com/chart/0/' + urls)
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

async function idApi() {
  var id = []
  var api = await selectedTop()
  for (const i of api.data) {
    id.push(i.id)
  }
  return id
}
async function UrlApi() {
  var urls = []
  var id = await idApi()
  for (const i in id) {
    urls.push('https://api.deezer.com/playlist/' + id[i] + '/tracks')
  }
  console.log('ahora vamos a ver que sale ' + urls)
  return urls
}

async function PlaylistName() {
  var final = []
  var api = await selectedTopList()
  var rut = await selectedTopName()

  for (const i in api) {
    var json = api[i].data.concat([
      { IdList: rut.data[i].id, NameList: rut.data[i].title }
    ])
    // console.log(i.data[i])
    final.push(json)
  }
  return final
}

async function prueba() {
  var a = []
  var p = await PlaylistName()

  for (var i in p) {
    var z = p[i]
    for (a in z) {
      if (z[a].IdList) console.log(z[a].NameList)
    }
  }
  return p[1]
}
