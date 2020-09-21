const express  = require('express');
const contactController  = require('../controller/contact.controller');
const router = express.Router();
const { auth, allowBreeder, authenticateRole, allowEmployee } = require("../middleware/auth");

router.post('/', auth, allowBreeder, allowEmployee, authenticateRole, contactController.addContact)
.get('/', auth, contactController.getContacts)
.get('/categories/all',auth, allowBreeder, authenticateRole, contactController.getContactWithCategories)
.get('/:id', auth, contactController.getContact)
.put('/:id', auth, allowBreeder, allowEmployee, authenticateRole, contactController.UpdateContact)
.delete('/soft/:id', auth, allowBreeder, allowEmployee, authenticateRole, contactController.softRemoveContact)
.delete('/soft/category/:category', auth, allowBreeder, allowEmployee, authenticateRole, contactController.softRemoveContactByCategory)
module.exports = router;