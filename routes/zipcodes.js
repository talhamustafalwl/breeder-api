const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const ZipcodeController = require('../controller/zipcode.controller');


router.route('/').delete(ZipcodeController.deleteall)
.get(ZipcodeController.getall)
.post(ZipcodeController.create)

router.route('/city/:city').get(ZipcodeController.getbyCity)

//for see/delete/update zipcode by id
router.route('/:id').get(ZipcodeController.getbyId)
  .delete(ZipcodeController.deletebyId)
.patch(ZipcodeController.updatebyId)

module.exports=router