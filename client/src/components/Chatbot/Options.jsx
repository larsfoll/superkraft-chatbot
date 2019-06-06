import React from 'react'
import PropTypes from 'prop-types'

const Options = ({ options, handleClick }) => (
  <div>
    {options && options.map(option => <button type="button" onClick={() => handleClick(option)} key={option}>{option}</button>)}
  </div>
)

Options.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default Options
