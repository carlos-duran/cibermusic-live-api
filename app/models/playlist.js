const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
)

module.exports = mongoose.model('Playlist', playlistSchema)
