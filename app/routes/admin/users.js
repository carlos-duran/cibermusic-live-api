const User = require('../../models/user')

module.exports = async app => {
  app.get('/', allUsers)
  app.put('/:userId/admin', setAdmin)
}

async function allUsers() {
  return User.find()
}

const setAdmin = {
  schema: {
    body: {
      type: 'object',
      required: ['admin'],
      properties: {
        admin: {
          type: 'boolean'
        }
      }
    }
  },
  async handler(request) {
    return User.update(
      {
        _id: request.params.userId
      },
      {
        admin: request.body.admin
      }
    )
  }
}
