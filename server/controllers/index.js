const db = require('../db')

const Conversation = {
  getAllConversations: (req, res) => {
    db.query('SELECT * FROM `conversation` LIMIT 10', (error, response) => {
      if (error) {
        res.json(error)
      }
      else {
        let result = JSON.stringify(response)
        result = JSON.parse(result)
        res.json(result)
      }
    })
  },
  getConversationById: (req, res) => {
    const query = `SELECT message.* FROM message INNER JOIN conversation ON message.conversation_id = conversation.id WHERE message.conversation_id = ${req.params.id} ORDER BY message.created_at ASC;`
    db.query(query, (error, response) => {
      if (error) {
        res.json(error)
      }
      else {
        let result = JSON.stringify(response)
        result = JSON.parse(result)
        res.json(result)
      }
    })
  }
}

module.exports = Conversation
