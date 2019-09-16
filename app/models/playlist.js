const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    songs: {
      type: [Number],
      default: []
    }
  },
  {
    toJSON: {
      getters: true,
      versionKey: false
    },
    timestamps: true
  }
)

module.exports = mongoose.model('Playlist', playlistSchema)
