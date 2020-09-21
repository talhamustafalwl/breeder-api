const express  = require('express');
const contactController  = require('../controller/activity.controller');
const router = express.Router();
const { auth } = require("../middleware/auth");

router.post('/', auth, contactController.create)
.get('/', auth, contactController.getall)
.get('/:id', auth, contactController.getbyId)
.put('/:id', auth, contactController.updatebyId)
.delete('/:id', auth, contactController.deletebyId)

module.exports = router;