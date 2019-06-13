module.exports = (app) => {
  const ConversationController = require('../controllers')

  app.route('/conversations')
    .get(ConversationController.getConversations)

  app.route('/conversations/:id')
    .get(ConversationController.getConversationById)
}