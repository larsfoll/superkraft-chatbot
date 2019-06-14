const baseUrl = 'http://localhost:8000'
const conversationsWrapper = document.querySelector('.conversations-wrapper')
const conversationsList = document.querySelector('.conversations-wrapper > ul')
const conversation = document.querySelector('.conversations-wrapper .conversation')
const deleteConversationButton = document.querySelector('.remove-conversation')
const currentConversation = document.querySelector('.conversations-wrapper > .conversation > ul')
const sortByOldBtn = document.querySelector('.sort-by-old')
const sortByNewBtn = document.querySelector('.sort-by-new')
const deleteFiltersBtn = document.querySelector('.delete-filters')
const weekdays = new Array('zo', 'ma', 'di', 'wo', 'do', 'vr', 'za')
const months = new Array('dec', 'jan', 'feb', 'mrt', 'apr', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov')
let currentConversationId;
let socket
let results = 0
let sort
let date
let allConversationsFetched = false

// Initial conversations are sorted by newest first
// So set initial state of button
sortByNewBtn.classList.add('active')

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

// Function to empty element
const removeChildren = (element) => {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild)
  }
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

// Adds a conversation to the list
const addListItem = (conversation) => {
  const listItem = document.createElement('li')
  const idElement = document.createElement('p')
  const idText = document.createTextNode(`#${conversation.id}`)
  idElement.appendChild(idText)
  listItem.appendChild(idElement)

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

// Open a conversation
const openConversation = (id, element) => {
  // If the current conversation id is equal to the selected id
  // there is no need to continue so stop the function
  if (currentConversationId === id) return
  currentConversationId = id
  const active = document.querySelector('.conversations-wrapper > ul > li.active')
  if (active) {
    // Remove active class from previously active element
    active.classList.remove('active')
  }
  element.classList.toggle('active')

  fetch(`${baseUrl}/conversations/${id}`)
    .then(response => response.json())
    .then(messages => {
      // Remove messages from the current conversation and add the new messages
      // Select conversation
      const conversationMessages = document.querySelector('.conversation > ul')
      removeChildren(conversationMessages)
      messages.forEach(message => createMessage(message))
    })
    // Always scroll to bottom of conversation on load
    // And enable the delete button
    .then(() => {
      scrollToBottom()
      enableDeleteConversationButton()
    })
}

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
    fetchConversations()
  }
}

// Fetch the conversations
const fetchConversations = () => {
  if (sort && results === 0) {
    // Empty the list, will be triggered when user has sorted the list
    removeChildren(conversationsList)
    allConversationsFetched = false
    conversationsList.addEventListener('scroll', onScrollConversationsList)
  }
  fetch(`${baseUrl}/conversations?results=${results}&sort=${sort ? sort : ''}&date=${date ? date : ''}`)
    .then(response => response.json())
    .then(conversations => {
      // When there are no more conversations to be fetched set var to true
      // To remove the event listener onScrollConversationsList
      if (conversations.length === 0) {
        allConversationsFetched = true
      }
      conversations.forEach(single => addListItem(single))
    })
}

const scrollToBottom = () => conversation.scrollTop = conversation.scrollHeight

// Sort conversation by old or new
const sortBy = (e, type) => {
  const activeSortButton = document.querySelector('.buttons-wrapper button.active')
  if (activeSortButton) {
    activeSortButton.classList.remove('active')
  }
  e.target.classList.toggle('active')
  results = 0
  sort = type
  allConversationsFetched = false
  removeChildren(currentConversation)
  fetchConversations()
}

const enableDeleteConversationButton = () => {
  deleteConversationButton.classList.add('enabled')
  deleteConversationButton.addEventListener('click', deleteConversation)
}

const deleteConversation = () => fetch(`${baseUrl}/conversations/${currentConversationId}`, {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(() => {
    deleteConversationButton.classList.remove('enabled')
    const active = document.querySelector('.conversations-wrapper > ul > li.active')
    active.remove()
    removeChildren(currentConversation)
  })

/**
  * Event listeners
  */
sortByOldBtn.addEventListener('click', (e) => sortBy(e, 'end'))
sortByNewBtn.addEventListener('click', (e) => sortBy(e, 'start'))
document.addEventListener('load', fetchConversations())
conversationsList.addEventListener('scroll', onScrollConversationsList)

const selectDateButton = document.querySelector('input[type="date"]')

selectDateButton.addEventListener('change', (e) => {
  date = e.target.value
  results = 0
  allConversationsFetched = false
  removeChildren(currentConversation)
  fetchConversations()
})

// Reset and fetch again with defaults
// deleteFiltersBtn.addEventListener('click', () => {
//   results = 0
//   sort = null
//   date = null
//   allConversationsFetched = false
//   fetchConversations
// })