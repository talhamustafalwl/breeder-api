const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const RotationController = require('../controller/rotation.controller');

//create,delete rotation only by admin
router.post("/",adminauth,RotationController.create)

router.route('/all').delete(adminauth,RotationController.deleteall)
  .get(auth,RotationController.getall)


//for see/delete/update rotation by id
router.route('/:id').get(auth,RotationController.getbyId)
  .delete(adminauth,RotationController.deletebyId)
.patch(adminauth,RotationController.updatebyId)

module.exports=router