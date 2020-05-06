const express = require('express');
const router = express.Router();
const ElementController = require('../controller/element.controller');

router.get('/', ElementController.getAllElements)
    .post('/', ElementController.addElement)
    .put('/:id', ElementController.modifyElement)


module.exports = router;