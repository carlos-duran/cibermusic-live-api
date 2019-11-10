const AssistantV2 = require('ibm-watson/assistant/v2')
const { IamAuthenticator } = require('ibm-watson/auth')

const sessions = {}

const assistantId = process.env.ASSISTANT_ID

const service = new AssistantV2({
  version: '2019-02-28',
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY
  }),
  url: process.env.ASSISTANT_URL,
  disableSslVerification: true
})

module.exports = {
  async createSession(identifier) {
    try {
      const { session_id: sessionId } = await service.createSession({
        assistantId
      })
      sessions[identifier] = sessionId
    } catch (e) {
      console.log(e)
    }
  },

  async deleteSession(identifier) {
    try {
      await service.deleteSession({
        assistantId,
        sessionId: sessions[identifier]
      })
      sessions[identifier] = null
    } catch (e) {
      console.log(e)
    }
  },

  async message(identifier, message) {
    try {
      const result = await service.message({
        assistantId,
        sessionId: sessions[identifier],
        input: {
          message_type: 'text',
          text: message
        }
      })
      console.log(result)
      return result
    } catch (error) {
      console.log(error)
    }
  }
}
