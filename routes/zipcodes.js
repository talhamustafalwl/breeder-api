const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const ZipcodeController = require('../controller/zipcode.controller');

//create,delete zipcode only by admin
router.post("/",adminauth,ZipcodeController.create)

router.route('/all').delete(adminauth,ZipcodeController.deleteall)
  .get(auth,ZipcodeController.getall)


//for see/delete/update zipcode by id
router.route('/:id').get(auth,ZipcodeController.getbyId)
  .delete(auth,ZipcodeController.deletebyId)
.patch(auth,ZipcodeController.updatebyId)

module.exports=router