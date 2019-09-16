const Playlist = require('../../models/playlist')

module.exports = async app => {
  app.get('/', allPlaylists)
  app.post('/', createPlaylist)
  app.put('/:playlistId', updatePlaylist)
}

async function allPlaylists(request) {
  return Playlist.find({ user: request.user.id })
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
    return Playlist.create({
      name: request.body.name,
      user: request.user.id
    })
  }
}

const updatePlaylist = {
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
    return Playlist.update(
      {
        _id: request.params.playlistId,
        user: request.user.id
      },
      {
        name: request.body.name
      }
    )
  }
}
