const express = require('express');
const router = express.Router();
const FormController = require('../controller/form.controller');
const { adminauth } = require('../middleware/adminauth');
const { Form } = require('../models/Form/Form');


router.get('/:categoryId', FormController.getFormByCategory)
    .post('/', adminauth, FormController.addForm)
    .put('/:id', FormController.modifyForm);

module.exports = router;