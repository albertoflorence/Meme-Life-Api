const express = require('express')
const app = express()

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log('Ouvindo na porta ' + PORT))

require('./express')(app)

module.exports = app
