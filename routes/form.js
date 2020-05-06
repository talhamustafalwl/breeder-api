const express = require('express');
const router = express.Router();
const FormController = require('../controller/form.controller');
const { adminauth } = require('../middleware/adminauth');
const { auth } = require('../middleware/auth');

router.get('/:categoryId', FormController.getFormByCategory)
    .post('/', adminauth, FormController.addForm)
    .put('/:id', auth, FormController.modifyForm);

module.exports = router;
