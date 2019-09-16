const Playlist = require('../../models/playlist')

module.exports = async app => {
  app.get('/', list)
  app.post('/', create)
  app.get('/:playlistId', show)
  app.put('/:playlistId', update)
  app.post('/:playlistId/song', addSong)
  app.delete('/:playlistId/song', removeSong)
}

async function list(request) {
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

async function show(request) {
  return Playlist.findOne({
    _id: request.params.playlistId,
    user: request.user.id
  })
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
        name: request.body.name
      }
    )
  }
}

const addSong = {
  schema: {
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'number'
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
        $addToSet: {
          songs: request.body.id
        }
      }
    )
  }
}

const removeSong = {
  schema: {
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'number'
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
        $pull: {
          songs: request.body.id
        }
      }
    )
  }
}
