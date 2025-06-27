const OpenAI = require('openai')
const dotenv = require('dotenv')
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
}) 

module.exports = {
    openai
}