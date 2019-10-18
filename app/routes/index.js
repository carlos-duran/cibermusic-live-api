module.exports = async app => {
  app.get('/', home)

  app.register(require('./admin'), { prefix: '/admin' })
  app.register(require('./auth'))
  app.register(require('./countries'))
  app.register(require('./user'))
}

const home = async () => 'CiberMusic Live!'
