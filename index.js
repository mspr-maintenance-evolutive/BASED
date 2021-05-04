require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.enable('trust proxy')
app.use(express.json())
app.use(morgan('common'))
app.use(cors('*'))

/**
 * GET /
 * @summary Home endpoint
 * @response 200 - OK
 */
app.get('/', async (req, res) => {
    res.send("Welcome on API BASED")
})

const port = process.env.PORT || 5225
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

module.exports = {app:app, server:server}
