const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
)

module.exports = mongoose.model('Playlist', playlistSchema)
