const dialogflow = require('dialogflow')
const uuid = require('uuid')
const db = require('../db')

const sessionId = uuid.v4()

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DF_SERVICE_ACCOUNT_PATH
})
const sessionPath = sessionClient.sessionPath(process.env.DF_PROJECT_ID, sessionId)

const Conversation = {
  getConversations: (req, res) => {
    let results = req.query.results ? req.query.results : 0
    results = JSON.parse(results)
    const sort = req.query.sort ? req.query.sort : 'start'
    // Select a maximum of 10 rows with each fetch request
    // The results variable is sent from the front end and will also increment with 10 times each
    // First time the rows 1 to 10 will be fetched, next time 11 to 20…
    const query = `SELECT * FROM \`conversation\` ORDER BY \`${sort}\` ${sort === 'start' ? 'ASC' : 'DESC'} LIMIT ?,10;`
    db.query(query, [
      results
    ], (error, response) => {
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
    // Select all messages belonging to the conversation
    db.query('SELECT message.* FROM `message` INNER JOIN `conversation` ON message.conversation_id = conversation.id WHERE message.conversation_id = ? ORDER BY message.created_at ASC;', [
      req.params.id
    ], (error, response) => {
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
  // Add conversation to db
  setConversation: (callback) => {
    try {
      db.query('INSERT INTO `conversation` () VALUES ()', (error, result) => {
        if (error) throw error
        // Callback to use the id
        callback(result.insertId)
      })
    } catch (error) {
      return 'Something went wrong please try again later'
    }
  },
  // Function that executes every time the connection with a socket is closed
  // Bug appears sometimes where a socket is initiated multiple times in 1 session
  // This function ensures no useless data remains inside the database
  endConversation: (id) => {
    // Select all the messages where the conversation_id is equal to the current id
    db.query('SELECT COUNT(*) as count FROM `message` WHERE conversation_id = ?;', [id], (error, response) => {
      const count = response[0].count
      // If rows are found, set the end time of the conversation
      if (count > 0) {
        db.query('UPDATE `conversation` SET `end` = CURRENT_TIMESTAMP WHERE id = ?', [id])
      } else if (count === 0) {
        // If no rows are found the conversation has no messages and can be safely deleted
        db.query('DELETE FROM `conversation` WHERE id = ?', [id])
      }
    })
  },
  addMessage: (id, text, type) => db.query('INSERT INTO `message` (`text`, `sender_type`, `conversation_id`) VALUES (?, ?, ?);', [text, type, id]),
  // Function to process the message from the client
  processMessage: async (message) => {
    try {
      let result
      // Request format for DialogFlow
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'nl',
          },
        },
      }
      await sessionClient.detectIntent(request)
        .then(responses => {
          result = responses[0].queryResult.fulfillmentText
        })
      return result
    } catch (error) {
      return 'Er ging iets fout probeer later opnieuw.'
    }
  },
  deleteConversation: (req, res) => {
    try {
      db.query('DELETE FROM `message` WHERE `conversation_id` = ?;', [req.params.id], (error, response) => {
        if (error) throw error
        if (response) {
          db.query('DELETE FROM `conversation` WHERE `id` = ?;', [req.params.id], (error, results) => {
            if (error) throw error
            res.json('Conversatie verwijderd.')
          })
        }
      })
    } catch (error) {
      res.json('Er ging iets fout bij het verwijderen, probeer later opnieuw.')
    }
  }
}

module.exports = Conversation
