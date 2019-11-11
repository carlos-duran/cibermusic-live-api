const User = require('../../models/user')

module.exports = async app => {
  app.put('/:user', update)
}

const update = {
  schema: {
    body: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthdate', 'country'],
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
    return User.update(
      {
        _id: request.user.id
      },
      {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        birthdate: request.body.birthdate,
        country: request.body.country
      }
    )
  }
}
