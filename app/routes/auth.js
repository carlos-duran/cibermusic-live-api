const User = require('../models/user')
const { BadRequest, Unauthorized } = require('http-errors')

module.exports = async app => {
  app.post('/login', login)
  app.post('/signup', signup)
}

const login = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      additionalProperties: false,
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        password: {
          type: 'string'
        }
      }
    }
  },
  async handler(request, reply) {
    const user = await User.login(request.body)
    if (user) {
      const token = await reply.jwtSign({ id: user.id })
      return { token }
    } else {
      throw new Unauthorized()
    }
  }
}

const signup = {
  schema: {
    body: {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'email',
        'password',
        'birthdate',
        'country'
      ],
      additionalProperties: false,
      properties: {
        firstName: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        lastName: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        email: {
          type: 'string',
          format: 'email'
        },
        password: {
          type: 'string'
        },
        birthdate: {
          type: 'string',
          format: 'date'
        },
        country: {
          type: 'string',
          maxLength: 50
        }
      }
    }
  },
  async handler(req) {
    try {
      return await User.create(req.body)
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequest('El correo electrónico ya está siendo usado')
      } else {
        throw new BadRequest(error.message)
      }
    }
  }
}
