const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const StatusController = require('../controller/status.controller');

//create,delete status only by admin
router.post("/",adminauth,StatusController.create)

router.route('/all').delete(adminauth,StatusController.deleteall)
  .get(auth,StatusController.getall)


//for see/delete/update status by id
router.route('/:id').get(auth,StatusController.getbyId)
  .delete(adminauth,StatusController.deletebyId)
.patch(adminauth,StatusController.updatebyId)

module.exports=router