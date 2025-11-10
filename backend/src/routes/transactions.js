const express = require('express')
const router = express.Router()
const controller = require('../controllers/transactionController')
const auth = require('../middleware/auth')

router.use(auth) // all routes protected
router.post('/', controller.create)
router.get('/', controller.list)
router.delete('/:id', controller.delete)

module.exports = router
