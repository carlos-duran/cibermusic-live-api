const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },
    birthdate: {
      type: String,
      regex: /^\d{4}-\d{2}-\d{2}$/
    },
    country: {
      type: String,
      maxlength: 50
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id
        delete ret.password
        return ret
      }
    },
    timestamps: true
  }
)

userSchema.virtual('age').get(function() {
  return new Date().getFullYear() - parseInt(this.birthdate.substring(0, 4))
})

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
})

userSchema.static('login', async function login({ email, password }) {
  const user = await this.findOne({ email })
  const res = user && (await bcrypt.compare(password, user.password))
  return res && user
})

module.exports = mongoose.model('User', userSchema)
