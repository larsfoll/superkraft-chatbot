require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const server = http.createServer(app)
const io = require('socket.io')(server)
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// const { processMessage } = require('./functions')
const routes = require('./routes')
const ConversationController = require('./controllers')
// const { addMessage, setConversation, endConversation } = require('./functions/queries')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

routes(app)

io.on('connection', async (socket) => {
  let id
  // On connection add conversation to db
  // And emit the initial message — not stored in database
  ConversationController.setConversation(data => id = data)
  socket.emit('dialogflow message', 'Hi, what can I help you with?')

  // When a message is received add it to the database
  socket.on('message', async (data) => {
    ConversationController.addMessage(id, data, 'human')
    // Let Dialogflow interpret the message and
    const response = await ConversationController.processMessage(data)
    // add the response to the db
    ConversationController.addMessage(id, response, 'agent')
    // Emit the DF response
    socket.emit('dialogflow message', response)
  })
  // Execute function on disconnect
  socket.on('disconnect', () => ConversationController.endConversation(id))
})

server.listen(process.env.PORT, () => console.log(`Server running on http://${process.env.DOMAIN}:${process.env.PORT}`))
