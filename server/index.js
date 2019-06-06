require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { processMessage } = require('./functions')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

io.on('connection', async (socket) => {
  socket.emit('dialogflow message', 'Yoo, waarmee kan ik u helpen?')
  socket.on('message', async (data) => {
    const response = await processMessage(data)
    socket.emit('dialogflow message', response)
  })
})

server.listen(process.env.PORT, () => console.log(`Server running on http://${process.env.DOMAIN}:${process.env.PORT}`))

module.exports = app
