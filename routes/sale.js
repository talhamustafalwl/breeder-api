const express = require('express');
const router = express.Router();
const SaleControoler = require('../controller/sales.controller');
const { auth } = require("../middleware/auth");


router.post('/saleAnimal', auth, SaleControoler.saleAnimal),


module.exports = router;