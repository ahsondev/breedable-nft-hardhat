const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const resolvePath = require('path').resolve

module.exports = function expressApp(routes) {
  const app = express()

  app.use(cors())
  app.use(compression())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.static(resolvePath(__dirname, '../../frontend/build')))
  app.use('/api', routes)
  app.get('/*', (req, res) => {
    const contents = fs.readFileSync(
      resolvePath(__dirname, '../../frontend/build/index.html'),
      'utf8',
    )
    res.send(contents)
  })

  return app
}
