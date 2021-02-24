const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole } = require("../middleware/auth");
const InvoiceController = require('../controller/invoice.controller');
const { autoCharge } = require("../middleware/autoCharge");

router.route('/').post(auth,InvoiceController.create)
    .delete(auth,InvoiceController.deleteallbreeder)
    .get(auth,InvoiceController.getallbreeder)

    // only by admin
router.route('/all').delete(adminauth,InvoiceController.deleteall)
  .get(adminauth,InvoiceController.getall)


//for see/delete/update note by id
router.route('/:id').get(auth,InvoiceController.getbyId)
    .delete(auth,InvoiceController.deletebyId)
    .patch(auth,InvoiceController.updatebyId)

router.route('/invoiceReminderEmail').post(auth, allowAdmin, allowBreeder, allowEmployee,autoCharge,InvoiceController.invoiceReminderEmail)

router.get('/seller/:sellerId', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, InvoiceController.getInvoiceBySellerId);
router.delete('/softremove/:id', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, InvoiceController.softRemoveInvoice);

module.exports=router