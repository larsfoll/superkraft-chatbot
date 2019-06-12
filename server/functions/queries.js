const db = require('../db')

const setConversation = (callback) => {
  try {
    db.query('INSERT INTO `conversation` () VALUES ()', (error, result) => {
      if (error) throw error
      callback(result.insertId)
    })
  } catch (error) {
    return 'Something went wrong please try again later'
  }
}


const endConversation = (id) => {
  const count = `SELECT COUNT(id) FROM message WHERE conversation_id = ${id};`
  if (count > 0) {
    db.query(`UPDATE conversation SET end = CURRENT_TIMESTAMP WHERE id=${id}`)
  } else if (count === 0) {
    db.query(`DELETE FROM conversation WHERE id = ${id}`)
  }
}

const addMessage = (id, text, type) => db.query(`INSERT INTO message (text, sender_type, conversation_id) VALUES ('${text}', '${type}', ${id});`)

module.exports = { setConversation, addMessage, endConversation }