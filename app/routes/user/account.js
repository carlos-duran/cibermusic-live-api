const User = require('../../models/user')
const { Unauthorized } = require('http-errors')

module.exports = async app => {
  app.get('/', find)
  app.put('/', update)
  app.put('/down', down)
}

async function find(request) {
  return request.user
}

const update = {
  schema: {
    body: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthdate', 'country'],
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
  async handler(request) {
    const { _id } = request.user
    return User.update({ _id }, request.body)
  }
}

const down = {
  schema: {
    body: {
      type: 'object',
      required: ['password'],
      additionalProperties: false,
      properties: {
        password: {
          type: 'string'
        }
      }
    }
  },
  async handler(request) {
    request.body.email = request.user.email
    const user = await User.login(request.body)
    if (user) {
      return User.update({ _id: request.user._id }, { active: false })
    } else {
      throw new Unauthorized()
    }
  }
}
