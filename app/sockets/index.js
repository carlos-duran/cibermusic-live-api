const assistantService = require('../services/watson-assistant')
const actions = require('../utils/watson-mapping')

module.exports = async function connectionHandler(socket) {
  await startChat.call(socket)
  socket.on('chat', onChat)
}

async function startChat() {
  const socket = this
  await assistantService.createSession(socket.id)
  onChat.call(socket, '')
}

async function onChat(message) {
  const socket = this
  const author = 'bot'
  let text = ''
  let action = null
  try {
    const output = await assistantService.message(socket.id, message.text)
    text = output.generic[0].text
    if (output.intents.length) {
      action = actions[output.intents[0].intent]
    }
  } catch (error) {
    text = 'Regreso en un momento...'
    startChat.call(socket)
  }

  socket.emit('chat', { action, author, text })
}
