const express  = require('express');
const contactController  = require('../controller/contact.controller');
const router = express.Router();
const { auth } = require("../middleware/auth");

router.post('/', auth, contactController.addContact)
.get('/', auth, contactController.getContact);

module.exports = router;