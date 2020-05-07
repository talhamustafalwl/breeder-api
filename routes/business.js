const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const BusinessController = require('../controller/business.controller');
const upload=require("../middleware/multerimage")

router.route('/').post(auth,upload.single('file'),BusinessController.create)
  .delete(auth,BusinessController.deleteallbreeder)
  .get(auth,BusinessController.getallbreeder)

//admin
router.route('/all')
  .delete(adminauth,BusinessController.deleteall)
  .get(adminauth,BusinessController.getall)


//for see/delete/update business by id
router.route('/:id').get(auth,BusinessController.getbyId)
  .delete(auth,BusinessController.deletebyId)
.patch(auth,upload.single('file'),BusinessController.updatebyId)

module.exports=router