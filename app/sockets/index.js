module.exports = function connectionHandler(socket) {
  console.log('User connected')
  socket.emit('chat', {
    author: 'bot',
    text: 'Hola!'
  })

  socket.on('chat', message => {
    console.log(message)
    setTimeout(() => {
      socket.emit('chat', {
        author: 'bot',
        text:
          'Te respondo del server pero aún no estoy conectado a Watson, jejeje.'
      })
    }, 100)
  })

  socket.on('disconnect', function() {
    console.log('User disconnected')
  })
}
