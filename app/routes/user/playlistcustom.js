const Playlist = require('../../models/playlistCustom')

module.exports = async app => {
  app.get('/playlistcustom', list)
  app.post('playlistcustom', create)
  app.put('playlistcustom', update)
}

async function list(request) {
  // return Playlist.find()
  return Playlist.find({ user: request.user.id }, '-songs')
}

const create = {
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

const update = {
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
        times: request.Playlist.times
      }
    )
  }
}
