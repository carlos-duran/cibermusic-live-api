const localize = require('ajv-i18n')
const { BadRequest } = require('http-errors')

const attrs = {
  birthdate: 'Fecha de cumpleaños',
  email: 'Correo electrónico'
}

const formats = {
  date: 'fecha'
}

module.exports = function errorHandler(error, request, reply) {
  if (error.validation) {
    localize.es(error.validation)
    const [first] = error.validation
    let message = `{${first.dataPath.slice(1)}} ${first.message}`
    const matchAttr = message.match(/{([^}]+)}/)
    const attr = matchAttr && matchAttr[1]
    if (attr) {
      message = message.replace(`{${attr}}`, attrs[attr])
      const matchFormat = message.match(/"([^"]+)"/)
      const format = matchFormat && matchFormat[1]
      if (format) {
        message = message.replace(`"${format}"`, `"${formats[format]}"`)
      }
    }
    reply.send(new BadRequest(message))
  } else {
    reply.send(error)
  }
}
