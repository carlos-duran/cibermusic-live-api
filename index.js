require('dotenv').config()
const requireDir = require('require-dir')
const fastify = require('fastify')
const mongoose = require('mongoose')
const { BadRequest } = require('http-errors')
const localize = require('ajv-i18n')

// Instance app
const app = fastify({ logger: true })
app.register(require('fastify-cors'))
app.register(require('fastify-jwt'), { secret: process.env.JWT_SECRET })

app.setErrorHandler(function(error, request, reply) {
  if (error.validation) {
    localize.es(error.validation)
    const [first] = error.validation
    reply.send(new BadRequest(`{${first.dataPath.slice(1)}} ${first.message}`))
  } else {
    reply.send(error)
  }
})

// Load models
requireDir('./app/models')

// Load routes
app.register(require('./app/routes'))

// Run the app!
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
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
