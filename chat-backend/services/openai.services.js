const { openai } = require('../config/openai.config.js')

const createThreadIfNotExists = async (threadId) => {
    return threadId || (await openai.beta.threads.create()).id
}

const sendMessageThread = async (threadId, message) => {
    await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message
    })
}

const startAssistant = async (threadId) => {
    return await openai.beta.threads.runs.create(threadId, {
        assistant_id: process.env.ASSISTANT_ID,
    })
}

const pollRunUnitlComplete = async ({ threadId, runId, interval = 200 }) => {
    let retries = 0
    let status = 'queued'

    while (status !== 'completed' && status !== 'failed' && retries < 10) {
        await new Promise((res) => setTimeout(res, interval))
        let runStatus = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        }).then(res => res.json());
        status = runStatus.status
        retries++
    }

    return status
}

const assistantReply = async (threadId) => {
    const messages = await openai.beta.threads.messages.list(threadId)
    const assistantMessage = messages.data.find((msg) => msg.role === 'assistant')
    const rawReply = assistantMessage?.content?.[0]?.text?.value || ''
    const cleanedReply = rawReply.replace(/【\d+:\d+†.*?】/g, '').trim()

    return cleanedReply
}


module.exports = {
    createThreadIfNotExists,
    sendMessageThread,
    startAssistant,
    pollRunUnitlComplete,
    assistantReply
}