const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const CurrencyController = require('../controller/currency.controller');

router.get('/', CurrencyController.getAllCurrencies)
    .post('/', CurrencyController.addCurrency)
    .put('/:id', CurrencyController.updateCurrency);

module.exports = router;