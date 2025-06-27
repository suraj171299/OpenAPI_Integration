const { chatAssistant } = require('../controllers/chat.controllers.js')
const express = require('express')

const router = express.Router()

router.route('/health').post((req, res) => {
    res.send('Route is healthy')
})

router.route('/query').post(chatAssistant)

module.exports = router