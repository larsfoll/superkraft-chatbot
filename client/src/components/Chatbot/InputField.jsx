import React, { useState } from 'react'

const initialMessageState = {
  id: null,
  text: '',
  type: '',
}

const InputField = () => {
  const [message, setMessage] = useState(initialMessageState)
  return (
    <input
      value={message.text}
      onChange={e => setMessage({
        text: e.target.value,
      })}
      type="text"
    />
  )
}

export default InputField
