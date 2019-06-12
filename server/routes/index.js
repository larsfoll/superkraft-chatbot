module.exports = (app) => {
  const ConversationController = require('../controllers')

  app.route('/conversations')
    .get(ConversationController.getAllConversations)

  app.route('/conversations/:id')
    .get(ConversationController.getConversationById)
}