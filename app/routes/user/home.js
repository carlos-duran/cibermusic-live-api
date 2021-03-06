const axios = require('axios')

module.exports = async app => {
  app.get('/home-music', homeMusic)
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
