const Playlist = require('../models/playlist')

module.exports = async app => {
  app.get('/', allPlaylists)
  app.post('/', createPlaylist)
}

async function allPlaylists() {
  return Playlist.find()
}

const createPlaylist = {
  schema: {
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          maxLength: 40
        }
      }
    }
  },
  async handler(request) {
    return Playlist.create(request.body)
  }
}
