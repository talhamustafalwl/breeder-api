const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const InvoiceItemController = require('../controller/invoiceItem.controller');


router.route('/').post(auth,InvoiceItemController.create)
    .delete(auth,InvoiceItemController.deleteallbreeder)
    .get(auth,InvoiceItemController.getallbreeder)

    // only by admin
router.route('/all').delete(adminauth,InvoiceItemController.deleteall)
  .get(adminauth,InvoiceItemController.getall)


//for see/delete/update InvoiceItem by id
router.route('/:id').get(auth,InvoiceItemController.getbyId)
    .delete(auth,InvoiceItemController.deletebyId)
    .patch(auth,InvoiceItemController.updatebyId)

module.exports=router