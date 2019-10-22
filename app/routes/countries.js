module.exports = async app => {
  app.get('/countries', countries)
}

async function countries() {
  return [
    'Argentina',
    'Bolivia',
    'Brasil',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Ecuador',
    'El Salvador',
    'Guayana Francesa',
    'Granada',
    'Guatemala',
    'Guayana',
    'Haití',
    'Honduras',
    'Jamaica',
    'México',
    'Nicaragua',
    'Paraguay',
    'Panamá',
    'Perú',
    'Puerto Rico',
    'República Dominicana',
    'Surinam',
    'Uruguay',
    'Venezuela'
  ]
}
