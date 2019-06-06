const socket = io.connect('http://localhost:8000');
const chatbot = document.querySelector('.chatbot')
const form = document.querySelector('form')
const input = document.querySelector('input')
const options = document.querySelector('.options')

const createNewMessage = (message, type) => {
  const listNode = document.createElement('li')
  listNode.classList.add(type)
  const textNode = document.createTextNode(message)
  listNode.appendChild(textNode)
  chatbot.appendChild(listNode)
}

const submitOption = (value) => {
  options.remove()
  createNewMessage(value, 'human')
  socket.emit('message', value)
}

const checkWeekend = () => {
  const today = new Date().getDay()
  const message = (today === 6 || 0) ? 'Hoera het is weekend, boitee' : 'Nog wa wachten'
  createNewMessage(message)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  createNewMessage(input.value, 'human')
  socket.emit('message', input.value)
  input.value = ''
})

socket.on('dialogflow message', (data) => createNewMessage(data, 'agent'));