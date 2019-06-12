const dialogflow = require('dialogflow')
const uuid = require('uuid')

const sessionId = uuid.v4()

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DF_SERVICE_ACCOUNT_PATH
})
const sessionPath = sessionClient.sessionPath(process.env.DF_PROJECT_ID, sessionId)

const sendWelcomeMessage = () => sessionClient.detectIntent({
  session: sessionPath,
  queryInput: {
    event: {
      name: 'WELCOME',
      languageCode: 'nl'
    }
  }
})

const processMessage = async (message) => {
  try {
    let result
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
}

// const request = {
//   session: sessionPath,
//   queryInput: {
//     text: {
//       text: 'Hallo',
//       languageCode: 'nl'
//     }
//   }
// }

// Send request and log result
// const responses = await sessionClient.detectIntent(request)
// console.log('Detected intent')
// const result = responses[0].queryResult
// console.log(`  Query: ${result.queryText}`)
// console.log(`  Response: ${result.fulfillmentText}`)
// if (result.intent) {
//   console.log(`  Intent: ${result.intent.displayName}`)
// } else {
//   console.log(`  No intent matched.`)
// }

module.exports = { sendWelcomeMessage, processMessage }
