module.exports = async app => {
  app.get('/countries', countries)
}

async function countries(){
  return [
    'Peru',
    'Mexico',
    'Colombia'
  ]
}
