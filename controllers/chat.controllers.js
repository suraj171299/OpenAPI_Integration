const {
    createThreadIfNotExists,
    sendMessageThread,
    startAssistant,
    pollRunUnitlComplete,
    assistantReply
} = require('../services/openai.services.js')

const dotenv = require('dotenv')
dotenv.config()
const chatAssistant = async (req, res) => {
    const { message, threadId } = req.body

    if (!message) {
        return res.status(400).json({
            message: "Message is required",
            success: false
        })
    }

    try {

        const thread_id = await createThreadIfNotExists(threadId)
        console.log(thread_id);

        await sendMessageThread(thread_id, message)

        const run = await startAssistant(thread_id)

        await pollRunUnitlComplete({ threadId: thread_id, runId: run.id })

        const assistant = await assistantReply(thread_id)
        
        res.status(200).json({
            reply: assistant || "No reply found",
            threadId: thread_id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "OpenAI Assistant Error",
            success: false
        })
    }
}


module.exports = {
    chatAssistant
}