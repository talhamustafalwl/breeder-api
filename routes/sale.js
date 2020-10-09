const express = require('express');
const router = express.Router();
const SaleControoler = require('../controller/sales.controller');
const { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole } = require("../middleware/auth");


router.post('/saleAnimal', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.saleAnimal);
router.get('/', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getSales);

module.exports = router;