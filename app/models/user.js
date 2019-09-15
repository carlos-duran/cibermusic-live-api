const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50
    },
    birth: String,
    country: String
  },
  {
    toJSON: {
      virtuals: true
    },
    timestamps: true
  }
)

userSchema.virtual('age').get(function() {
  return new Date().getFullYear() - parseInt(this.birth.substring(0, 4))
})

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
})

userSchema.static('login', async function login({ email, password }) {
  const user = await this.findOne({ email })
  const res = await bcrypt.compare(password, user.password)
  return res && user
})

module.exports = mongoose.model('User', userSchema)
