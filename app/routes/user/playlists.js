const Playlist = require('../../models/playlist')

module.exports = async app => {
  app.get('/', list)
  app.post('/', create)
  app.delete('/:playlistId', remove)
  app.get('/:playlistId', show)
  app.put('/:playlistId', update)
  app.post('/:playlistId/song', addSong)
  app.delete('/:playlistId/:trackId', removeSong)
}

async function list(request) {
  const playlists = await Playlist.find({ user: request.user.id })
    .sort('-special')
    .exec()
  if (!playlists.some(p => p.special === 'favorites')) {
    const favorites = await Playlist.create({
      name: 'Favoritos',
      user: request.user.id,
      special: 'favorites'
    })
    playlists.unshift(favorites)
  }
  return playlists
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
        user: request.user.id,
        special: null
      },
      {
        name: request.body.name
      }
    )
  }
}

async function remove(request) {
  return Playlist.deleteOne({
    _id: request.params.playlistId,
    user: request.user.id,
    special: null
  })
}

const addSong = {
  schema: {
    body: {
      type: 'object',
      required: [
        'id',
        'title',
        'title_short',
        'artist',
        'album',
        'preview',
        'duration'
      ],
      properties: {
        id: {
          type: 'number'
        },
        title: {
          type: 'string'
        },
        title_short: {
          type: 'string'
        },
        artist: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string'
            },
            picture_medium: {
              type: 'string'
            }
          }
        },
        album: {
          type: 'object',
          required: ['cover_small', 'cover_medium', 'cover_big', 'title'],
          properties: {
            cover_small: {
              type: 'string'
            },
            cover_medium: {
              type: 'string'
            },
            cover_big: {
              type: 'string'
            },
            title: {
              type: 'string'
            }
          }
        },
        preview: {
          type: 'string'
        },
        duration: {
          type: 'number'
        }
      }
    }
  },
  async handler(request) {
    return Playlist.update(
      {
        _id: request.params.playlistId,
        user: request.user.id,
        'tracks.id': { $ne: request.body.id }
      },
      {
        $addToSet: {
          tracks: request.body
        }
      }
    )
  }
}

async function removeSong(request) {
  return Playlist.updateOne(
    {
      _id: request.params.playlistId,
      user: request.user.id,
      'tracks.id': request.params.trackId
    },
    {
      $pull: {
        tracks: { id: request.params.trackId }
      }
    }
  )
}
