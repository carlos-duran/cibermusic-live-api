const assistantService = require('../services/watson-assistant')

module.exports = async function connectionHandler(socket) {
  console.log('User connected')
  await startChat.call(socket)

  socket.on('chat', onChat)

  socket.on('disconnect', function() {
    console.log('User disconnected')
  })
}

async function startChat() {
  const socket = this
  await assistantService.createSession(socket.id)
  socket.emit('chat', {
    author: 'bot',
    text: await assistantService.message(socket.id)
  })
}

async function onChat(message) {
  const socket = this
  let text = ''
  try {
    text = await assistantService.message(socket.id, message.text)
  } catch (error) {
    text = 'Regreso en un momento...'
    startChat.call(socket)
  }

  socket.emit('chat', {
    author: 'bot',
    text
  })
}
