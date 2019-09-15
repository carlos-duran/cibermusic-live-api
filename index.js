require('dotenv').config()
const requireDir = require('require-dir')
const fastify = require('fastify')
const mongoose = require('mongoose')

// Instance app
const app = fastify({ logger: true })
app.register(require('fastify-cors'))
app.register(require('fastify-jwt'), { secret: process.env.JWT_SECRET })

// Load models
requireDir('./app/models')

// Load routes
app.register(require('./app/routes/home'))
app.register(require('./app/routes/playlists'), { prefix: '/playlists' })

// Run the app!
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    await app.listen(3000)
    app.log.info(`Server listening on ${app.server.address().port}`)
    app.ready(() => {
      console.log(app.printRoutes())
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
