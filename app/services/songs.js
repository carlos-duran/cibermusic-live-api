const songs = [
  { name: 'Despacito', year: 2016 },
  { name: 'Despacito2', year: 2016 },
  { name: 'Despacito3', year: 2019 },
  { name: 'Despacito34', year: 2016 }
]

function findAll() {
  return songs
}

function findByName(name) {
  const song = songs.find(s => s.name === name)
  return song
}

module.exports = { findAll, findByName }
