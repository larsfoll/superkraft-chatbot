require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
// const path = require('path');
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { processMessage } = require('./config/dialogflow')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
  socket.on('message', async (data, callback) => {
    const response = await processMessage(data)
    return callback(response)
  })
})

server.listen(process.env.PORT, () => console.log(`Server running on http://${process.env.DOMAIN}:${process.env.PORT}`))

module.exports = app
