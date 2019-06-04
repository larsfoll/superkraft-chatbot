import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import Message from './Message'

const socket = socketIOClient('localhost:8000')

const initialMessageState = {
  id: null,
  text: '',
  type: '',
}

const Messages = () => {
  const [message, setMessage] = useState(initialMessageState)
  const [messages, setMessages] = useState([{
    id: 1,
    text: 'Hallo',
    type: 'agent',
  }])
  useEffect(() => {
    socket.emit('dialogflow message', 'Hallo')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message, async (response) => {
      await socket.emit('dialogflow message', response)
      const newMessage = {
        id: Date.now(),
        text: message.text,
        type: 'human',
      }
      await setMessages([...messages, newMessage])
      const responseChatbot = {
        id: response.responseId,
        text: response.queryResult.fulfillmentText,
        type: 'agent',
      }
      await setTimeout(() => setMessages([...messages, newMessage, responseChatbot]), 1000)
    })
    setMessage(initialMessageState)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={message.text}
          onChange={e => setMessage({
            text: e.target.value,
            id: null,
          })}
          type="text"
        />
        <button type="submit">Send</button>
      </form>
      {messages
        && messages.map(
          single => <Message message={single.text} key={single.id} type={single.type} />,
        )
      }
    </div>
  )
}

export default Messages
