import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import Message from './Message'
import Options from './Options'

const socket = socketIOClient('localhost:8000')

const initialMessageState = {
  id: null,
  text: '',
  type: '',
}

const initialOptions = ['Contact', 'Boitee']

const Messages = () => {
  const [message, setMessage] = useState(initialMessageState)
  const [messages, setMessages] = useState([{
    id: 1,
    text: 'Hallo',
    type: 'agent',
  }])
  const [options, setOptions] = useState(initialOptions)

  useEffect(() => {
    socket.emit('dialogflow message', 'Hallo, waarmee kan ik u helpen')
  }, [])

  useEffect(() => {
    socket.on('message', msg => console.log('msg: ', msg))
  }, [])

  const handleClick = (option) => {
    console.log('TCL: handleClick -> option', option)
    socket.emit('message', option, async (response) => {
      // never executed, has to be an object
      await socket.emit('dialogflow message', response)
      const newMessage = {
        id: Date.now(),
        text: option,
        type: 'human',
      }
      console.log('TCL: handleClick -> newMessage', newMessage)
      setMessages([...messages, newMessage])
      const responseChatbot = {
        id: response.responseId,
        text: response.queryResult.fulfillmentText,
        type: 'agent',
      }
      console.log('TCL: handleClick -> responseChatbot', responseChatbot)
      setTimeout(() => setMessages([...messages, newMessage, responseChatbot]), 1000)
    })
    setOptions([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message, async (response) => {
      await socket.emit('dialogflow message', response)
      const newMessage = {
        id: Date.now(),
        text: message.text,
        type: 'human',
      }
      setMessages([...messages, newMessage])
      const responseChatbot = {
        id: response.responseId,
        text: response.queryResult.fulfillmentText,
        type: 'agent',
      }
      setTimeout(() => setMessages([...messages, newMessage, responseChatbot]), 1000)
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
        {options && <Options options={options} handleClick={handleClick} />}
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
