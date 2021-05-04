require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const based = require('./src/based')

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

/**
 * GET /
 * @summary Home endpoint
 * @response 200 - OK
 */
app.get('/eclairage/horaires/:date', async (req, res) => {
    console.log(req.params.date)
    if(based.checkFormat(req.params.date)){
        if(based.fileExist(req.params.date)){
            //res.setHeader('content-type', 'text/csv')
            //res.setHeader('Content-Disposition', 'attachment;filename=espaces_ouverts.csv')
            res.send(based.getSchedules())
        } else {
            res.status(404).send("Date not found")
        }
    } else {
        res.status(400).send("Your date format is invalid, expected: ddMMYYYY")
    }
    
})

const port = process.env.PORT || 5225
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

module.exports = {app:app, server:server}
