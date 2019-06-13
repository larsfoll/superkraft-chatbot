const baseUrl = 'http://localhost:8000'
const conversationsWrapper = document.querySelector('.conversations-wrapper')
const conversationsList = document.querySelector('.conversations-wrapper > ul')
const conversation = document.querySelector('.conversations-wrapper .conversation')
const weekdays = new Array('zo', 'ma', 'di', 'wo', 'do', 'vr', 'za')
const months = new Array('dec', 'jan', 'feb', 'mrt', 'apr', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov')
let currentConversationId;
let socket;
let results = 0;
let allConversationsFetched = false

// Format time based on type
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

// Add message to list
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

// Open a conversation
const openConversation = (id, element) => {
  // If the current conversation id is equal to the selected id
  // there is no need to continue so stop the function
  if (currentConversationId === id) return

  const active = document.querySelector('.active')
  if (active) {
    // Remove active class from previous active element
    active.classList.remove('active')
  }
  element.classList.toggle('active')
  currentConversationId = id

  fetch(`${baseUrl}/conversations/${id}`)
    .then(response => response.json())
    .then(messages => {
      // Remove messages from the current conversation and add the new messages

      // Select conversation
      const conversationMessages = document.querySelector('.conversation > ul')
      // Make a clone with no children
      const conversationMessagesClone = conversationMessages.cloneNode(false)
      // Replace the old conversation with the empty clone
      // Otherwise the messages from the previous conversation would still be in the div
      // And the new ones would be pushed to the div along with the old ones
      conversationMessages.parentNode.replaceChild(conversationMessagesClone, conversationMessages)
      messages.forEach(message => createMessage(message))
    })
    // Always scroll to bottom of conversation on load
    .then(() => scrollToBottom())
}

// Adds a conversation to the list
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

// Fetch the conversations
const fetchConversations = () => fetch(`${baseUrl}/conversations?results=${results}`)
  .then(response => response.json())
  .then(conversations => {
    // When there are no more conversations to be fetched set var to true
    // To remove the event listener onScrollConversationsList
    if (conversations.length === 0) {
      allConversationsFetched = true
    }
    conversations.forEach(single => addListItem(single))
  })

const scrollToBottom = () => conversation.scrollTop = conversation.scrollHeight

// When the user scrolls to the bottom of the list the next conversations will be fetched
const onScrollConversationsList = () => {
  // Remove the event listener and stop the function once all conversations are fetched
  if (allConversationsFetched === true) {
    conversationsList.removeEventListener('scroll', onScrollConversationsList)
    return
  }
  // When the bottom is reached fetch the next 10 conversations
  // First time it'll fetch results 1 to 10, second time 11 to 20 etc.
  if (conversationsList.scrollTop === (conversationsList.scrollHeight - conversationsList.offsetHeight)) {
    results = results + 10;
    fetchConversations(results)
  }
}

document.addEventListener('load', fetchConversations())

conversationsList.addEventListener('scroll', onScrollConversationsList)
