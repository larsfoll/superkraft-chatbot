let socket;
const chatbot = document.querySelector('.chatbot')
const form = document.querySelector('form')
const input = document.querySelector('form > input')
const options = document.querySelector('.options')
const sumbitButton = document.querySelector('input[type="submit"]')
const initializeConversationBtn = document.querySelector('.initialize-conversation')

const createNewMessage = (message, type) => {
  const listNode = document.createElement('li')
  listNode.classList.add(type)
  const textNode = document.createTextNode(message)
  listNode.appendChild(textNode)
  chatbot.appendChild(listNode)
}


const initializeConversation = () => {
  socket = io.connect('http://localhost:8000')
  socket.on('dialogflow message', data => createNewMessage(data, 'agent'))
  initializeConversationBtn.removeEventListener('click', initializeConversation)
}

initializeConversationBtn.addEventListener('click', initializeConversation)

const submitOption = (value) => {
  options.remove()
  createNewMessage(value, 'human')
  // if (value === "Wanneer begint 't weekend?") {
  //   return setTimeout(() => checkWeekend(), 1000)
  // }
  socket.emit('message', value)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  createNewMessage(input.value, 'human')
  socket.emit('message', input.value)
  input.value = ''
  sumbitButton.setAttribute('disabled', '')
})

input.addEventListener('input', (e) => {
  const { value } = e.srcElement
  if (value.length > 0 && sumbitButton.hasAttribute('disabled')) {
    sumbitButton.removeAttribute('disabled')
  } else if (value.length <= 0 && !sumbitButton.hasAttribute('disabled')) {
    sumbitButton.setAttribute('disabled', '')
  }
})

const countDownDate = new Date('Jun 7, 2019 17:45:00').getTime()

const checkWeekend = () => {
  const now = new Date().getTime()

  const distance = countDownDate - now

  // const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  const message = `Nog ${hours} uur, ${minutes} minuten en ${seconds} seconden 🎉🍻`
  createNewMessage(message, 'agent')

  if (distance < 0) {
    clearInterval(x)
    createNewMessage('Weekend kan beginnen', 'agent')
  }
}
