const User = require('../../models/user')

module.exports = async app => {
  app.get('/', find)
  app.put('/', update)
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
