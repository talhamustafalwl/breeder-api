const express  = require('express');
const contactController  = require('../controller/contact.controller');
const router = express.Router();
const { auth, allowBreeder, authenticateRole, allowEmployee } = require("../middleware/auth");
const { autoCharge } = require('../middleware/autoCharge');

router.post('/', auth, allowBreeder, allowEmployee, authenticateRole,autoCharge, contactController.addContact)
.get('/', auth, contactController.getContacts)
.get('/breeders', auth, contactController.getContactsBreeder)
.get('/categories/all',auth, allowBreeder, authenticateRole, contactController.getContactWithCategories)
.get('/:id', auth, contactController.getContact)
.put('/:id', auth, allowBreeder, allowEmployee, authenticateRole, contactController.UpdateContact)
.delete('/soft/:id', auth, allowBreeder, allowEmployee, authenticateRole, contactController.softRemoveContact)
.delete('/soft/category/:category', auth, allowBreeder, allowEmployee, authenticateRole, contactController.softRemoveContactByCategory)
module.exports = router;