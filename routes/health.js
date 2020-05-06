const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const HealthController = require('../controller/health.controller');
const upload=require("../middleware/multerimage")

router.route('/').post(auth,upload.single('file'),HealthController.create)
  .delete(auth,HealthController.deleteallbreeder)
  .get(auth,HealthController.getallbreeder)

//admin
router.route('/all')
  .delete(adminauth,HealthController.deleteall)
  .get(adminauth,HealthController.getall)


//for see/delete/update health by id
router.route('/:id').get(auth,HealthController.getbyId)
  .delete(auth,HealthController.deletebyId)
.patch(auth,upload.single('file'),HealthController.updatebyId)

module.exports=router