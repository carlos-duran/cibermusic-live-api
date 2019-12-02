const assistantService = require('../services/watson-assistant')
const getAnswer = require('../utils/watson-mapping')

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
  let answer = {}
  try {
    const output = await assistantService.message(socket.id, message.text)
    answer = getAnswer(output)
  } catch (error) {
    console.log(error)
    answer.text = 'Regreso en un momento...'
    startChat.call(socket)
  }

  socket.emit('chat', { ...answer, author })
}
