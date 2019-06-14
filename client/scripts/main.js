let socket;
const chatbot = document.querySelector('.chatbot')
const form = document.querySelector('form')
const input = document.querySelector('form > input')
const options = document.querySelector('.options')
const optionsInput = document.querySelectorAll('.options > input')
const sumbitButton = document.querySelector('input[type="submit"]')
const initializeConversationBtn = document.querySelector('.initialize-conversation')

// Adds message to the UI
const createNewMessage = (message, type) => {
  const listNode = document.createElement('li')
  listNode.classList.add(type)
  const textNode = document.createTextNode(message)
  listNode.appendChild(textNode)
  chatbot.appendChild(listNode)
}

// Establish connection with socket
const initializeConversation = () => {
  socket = io.connect('http://localhost:8000')
  socket.on('dialogflow message', data => createNewMessage(data, 'agent'))
  // Remove event handler to prevent multiple connections
  initializeConversationBtn.removeEventListener('click', initializeConversation)
  initializeConversationBtn.setAttribute('disabled', '')
  optionsInput.forEach(option => option.removeAttribute('disabled'))
  input.removeAttribute('disabled')
}

const submitOption = (value) => {
  options.remove()
  createNewMessage(value, 'human')
  socket.emit('message', value)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  createNewMessage(input.value, 'human')
  socket.emit('message', input.value)
  input.value = ''
  sumbitButton.setAttribute('disabled', '')
})

// Event listener disables submit button
// to prevent user from sending empty messages
const onInput = (e) => {
  const { value } = e.srcElement
  if (value.length > 0 && sumbitButton.hasAttribute('disabled')) {
    sumbitButton.removeAttribute('disabled')
  } else if (value.length <= 0 && !sumbitButton.hasAttribute('disabled')) {
    sumbitButton.setAttribute('disabled', '')
  }
}
