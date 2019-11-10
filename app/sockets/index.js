const assistantService = require('../services/watson-assistant')

module.exports = async function connectionHandler(socket) {
  console.log('User connected')
  await assistantService.createSession(socket.id)
  socket.emit('chat', {
    author: 'bot',
    text: await assistantService.message(socket.id)
  })

  socket.on('chat', async message => {
    let text = ''
    try {
      text = await assistantService.message(socket.id, message.text)
    } catch (error) {
      console.log(error)
      text = 'Ando estresado, regresa más tarde!'
    }
    socket.emit('chat', {
      author: 'bot',
      text
    })
  })

  socket.on('disconnect', function() {
    console.log('User disconnected')
  })
}
