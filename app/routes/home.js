const User = require('../models/user')

module.exports = async app => {
  app.get('/', home)
  app.post('/login', login(app))
  app.post('/signup', signup)
}

const home = async () => 'CiberMusic Live'

const login = app => ({
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
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
      const token = app.jwt.sign({ id: user.id })
      return { token }
    } else {
      reply.code(401)
      throw new Error('Not authenticated')
    }
  }
})

const signup = {
  schema: {
    body: {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'email',
        'password',
        'birth',
        'country'
      ],
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        password: {
          type: 'string'
        },
        birth: {
          type: 'string',
          format: 'date'
        },
        country: {
          type: 'string'
        }
      }
    }
  },
  async handler(req) {
    return User.create(req.body)
  }
}
