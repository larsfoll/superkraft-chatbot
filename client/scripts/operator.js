const baseUrl = 'http://localhost:8000'
const conversationsList = document.querySelector('.conversations-wrapper > ul')
const conversation = document.querySelector('.conversations-wrapper .conversation')
const weekdays = new Array('zo', 'ma', 'di', 'wo', 'do', 'vr', 'za')
const months = new Array('dec', 'jan', 'feb', 'mrt', 'apr', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov')
let currentConversationId;
let socket;

// Formatted time should change
// If different week 13 apr. om 14:22
// If current day index is after or equal to current
// If different year 10 jun. 2018 om 22:18

const formatTime = (time, type = null) => {
  const date = new Date(time)
  const timeElement = document.createElement('time')

  timeElement.setAttribute('datetime', time)

  const year = date.getFullYear()
  const month = months[date.getMonth()]
  const day = date.getDay()
  const dayName = weekdays[date.getDay()]
  const hours = date.getHours()
  let minutes = date.getMinutes()
  minutes = (minutes < 10 ? '0' : '') + minutes
  let formattedTimeString = `${dayName} ${day} ${month}. ${year} om ${hours}:${minutes}`

  switch (type) {
    case 'start':
      formattedTimeString = `Start: ${formattedTimeString}`
      break;
    case 'end':
      formattedTimeString = `Einde: ${formattedTimeString}`
      break;
    default:
      break;
  }
  const text = document.createTextNode(formattedTimeString)
  timeElement.appendChild(text)
  return timeElement
}

const createMessage = (message) => {
  const conversationMessages = document.querySelector('.conversation > ul')
  const listItem = document.createElement('li')
  const pharagraphElement = document.createElement('p')
  const dateSent = formatTime(message.created_at)
  const text = document.createTextNode(message.text)

  listItem.classList.add(message.sender_type)
  pharagraphElement.appendChild(text)
  listItem.appendChild(pharagraphElement)
  listItem.appendChild(dateSent)
  conversationMessages.appendChild(listItem)
}

const openConversation = (id, element) => {
  if (currentConversationId === id) return
  const active = document.querySelector('.active')
  if (active) {
    active.classList.remove('active')
  }
  element.classList.toggle('active')
  currentConversationId = id

  // if (!socket) {
  //   console.log('no socket yet')
  //   socket = io('http://localhost:8000')
  //   socket.of
  //   socket.on('dialogflow message', data => {
  //     console.log(data)
  //   })
  // }
  fetch(`${baseUrl}/conversations/${id}`)
    .then(response => response.json())
    .then(messages => {
      const conversationMessages = document.querySelector('.conversation > ul')
      const conversationMessagesClone = conversationMessages.cloneNode(false)
      conversationMessages.parentNode.replaceChild(conversationMessagesClone, conversationMessages)
      messages.forEach(message => createMessage(message))
    })
    .then(() => scrollToBottom())
}

const addListItem = (conversation) => {
  const listItem = document.createElement('li')

  listItem.classList.add(conversation.id)
  listItem.addEventListener('click', () => openConversation(conversation.id, listItem))

  const startConversation = formatTime(conversation.start, 'start')
  listItem.appendChild(startConversation)
  if (conversation.end) {
    const endConversation = formatTime(conversation.end, 'end')
    listItem.appendChild(endConversation)
  }
  conversationsList.appendChild(listItem)
}

fetch(`${baseUrl}/conversations`)
  .then(response => response.json())
  .then(data => data.forEach(element => addListItem(element)))

const scrollToBottom = () => {
  conversation.scrollTop = conversation.scrollHeight
}