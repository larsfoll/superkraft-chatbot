import React from 'react'
import PropTypes from 'prop-types'

const Message = ({ message, type }) => {
  console.log('render message')
  return (
    <>
      <p>{message}</p>
      <h6>{type}</h6>
    </>
  )
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['human', 'agent']).isRequired,
}

export default Message
