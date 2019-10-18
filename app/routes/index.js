module.exports = async app => {
  app.get('/', home)

  app.register(require('./countries'))
  app.register(require('./auth'))
  app.register(require('./user'))
  app.register(require('./admin'), { prefix: '/admin' })
}

const home = async () => 'CiberMusic Live!'
