const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema({
  id: Number,
  title: String,
  title_short: String,
  artist: {
    name: String,
    picture_medium: String
  },
  album: {
    cover_small: String,
    cover_medium: String,
    cover_big: String,
    title: String
  },
  preview: String
})

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
      type: [trackSchema],
      default: []
    },
    special: {
      type: Boolean,
      name: {
        type: String,
        require: true,
        default: 'favorite'
      }
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
