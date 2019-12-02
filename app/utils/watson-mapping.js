const getAnswer = output => {
  let text = output.generic[0].text
  let actions = []

  if (!output.intents.length) {
    return { text, actions }
  }

  const [{ intent }] = output.intents
  let phrase

  switch (intent) {
    case 'EditarPefil':
      actions = [
        {
          name: 'navigate',
          value: '/perfil'
        }
      ]
      break
    case 'BuscadorCanciones':
      phrase = getSongAndArtist(output)
      if (phrase) {
        actions = [
          {
            name: 'search-play',
            value: phrase
          }
        ]
      } else {
        text = 'Muy pronto agregaremos más canciones!'
      }
      break
    default:
      break
  }
  return { text, actions }
}

module.exports = getAnswer

function getSongAndArtist(output) {
  let phrase = ''
  if (output.entities.length) {
    const songEntity = output.entities.find(e => e.entity === 'Songs')
    if (songEntity) {
      phrase = songEntity.value
    }
    const artistEntity = output.entities.find(e => e.entity === 'Artists')
    if (artistEntity) {
      phrase += ' ' + artistEntity.value
    }
  }
  return phrase.trim()
}
