const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const chatRoutes = require('./routes/chat.routes.js')
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/open-ai', chatRoutes)


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'widget.html'))
})
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`OpenAPI chat server running at ${PORT}`);
})