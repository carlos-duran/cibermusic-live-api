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
    const response = await service.createSession({
      assistantId
    })
    console.log(response.result)
    if (response.status === 201) {
      sessions[identifier] = response.result.session_id
    } else {
      throw new Error('Invalid request')
    }
  },

  async deleteSession(identifier) {
    await service.deleteSession({
      assistantId,
      sessionId: sessions[identifier]
    })
    sessions[identifier] = null
  },

  async message(identifier, text) {
    console.log(sessions[identifier])
    const response = await service.message({
      assistantId,
      sessionId: sessions[identifier],
      input: {
        message_type: 'text',
        text
      }
    })
    console.log(JSON.stringify(response.result, null, 2))
    return response.result.output.generic[0].text
  }
}
