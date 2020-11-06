const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowAdmin, allowBreeder, authenticateRole } = require("../middleware/auth");
const InstallmentController = require('../controller/installment.controller');


router.route('/').post(auth,InstallmentController.create)
    .delete(auth,InstallmentController.deleteallbreeder)
    .get(auth,InstallmentController.getallbreeder)

    // only by admin
router.route('/all').delete(adminauth,InstallmentController.deleteall)
  .get(adminauth,InstallmentController.getall)


//for see/delete/update Installment by id
router.route('/:id').get(auth,InstallmentController.getbyId)
    .delete(auth,InstallmentController.deletebyId)
    .patch(auth,InstallmentController.updatebyId)

router.put('/pay/:id', auth, allowAdmin, allowBreeder, authenticateRole, InstallmentController.payIntallment);

module.exports=router