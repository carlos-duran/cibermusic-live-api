const mongoose = require('mongoose')

const playlistCustomSchema = new mongoose.Schema(
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
    songs: [
      {
        id: {
          type: Number
        },
        times: {
          type: Number
        }
      }
    ]
  },
  {
    toJSON: {
      getters: true,
      versionKey: false
    },
    timestamps: true
  }
)

module.exports = mongoose.model('PlaylistCustom', playlistCustomSchema)
