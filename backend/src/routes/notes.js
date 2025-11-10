const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { addNote, listNotes, deleteNote } = require('../controllers/notesController')

router.use(auth)
router.post('/', addNote)
router.get('/', listNotes)
router.delete('/:id', deleteNote)

module.exports = router
