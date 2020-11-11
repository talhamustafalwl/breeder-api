const express = require('express');
const router = express.Router();
const SaleControoler = require('../controller/sales.controller');
const { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole } = require("../middleware/auth");


router.get('/breederListSimple', auth, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getAllBreederListSimple)
router.get('/breederSalesList/:buyerId', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getAllBreederSaleList)
router.get('/breederList', auth, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getAllBreederList)


router.post('/saleAnimal', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.saleAnimal);
router.get('/', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getSales);
router.get('/:id', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getSaleDetail);
router.put('/changePaidStatus/:id', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.changePaidStatus);
router.get('/user/:id/:breederId', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SaleControoler.getSaleByUser);
router.get('/graphdata/:breederId', SaleControoler.getGraphData);


module.exports = router;