require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const server = http.createServer(app)
const io = require('socket.io')(server)
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { processMessage } = require('./functions')
const routes = require('./routes')
const { addMessage, setConversation, endConversation } = require('./functions/queries')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

routes(app)

io.on('connection', async (socket) => {
  let id
  setConversation((data) => {
    id = data
  })
  socket.emit('dialogflow message', 'Hi, what can I help you with?')
  socket.on('message', async (data) => {
    addMessage(id, data, 'human')
    const response = await processMessage(data)
    addMessage(id, response, 'agent')
    socket.emit('dialogflow message', response)
  })
  socket.on('disconnect', () => endConversation(id))
})

server.listen(process.env.PORT, () => console.log(`Server running on http://${process.env.DOMAIN}:${process.env.PORT}`))
