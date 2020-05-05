const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const VacinationController = require('../controller/vacination.controller');


router.route('/').post(auth,VacinationController.create)
  .delete(auth,VacinationController.deleteallbreeder)
  .get(auth,VacinationController.getallbreeder)

//admin
router.route('/all')
  .delete(adminauth,VacinationController.deleteall)
  .get(adminauth,VacinationController.getall)


//for see/delete/update vacination by id
router.route('/:id').get(auth,VacinationController.getbyId)
  .delete(auth,VacinationController.deletebyId)
.patch(auth,VacinationController.updatebyId)

module.exports=router