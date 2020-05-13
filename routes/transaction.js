const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
//const { auth } = require("../middleware/auth");
const TransactionController = require('../controller/transaction.controller');

//create,delete unit only by admin
router.route('/').delete(adminauth,TransactionController.deleteall)
  .get(adminauth,TransactionController.getall)


router.route('/:id').get(adminauth,TransactionController.getbyId)
  .delete(adminauth,TransactionController.deletebyId)
.patch(adminauth,TransactionController.updatebyId)

module.exports=router