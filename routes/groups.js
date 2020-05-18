const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const GroupController = require('../controller/group.controller');

router.route('/').post(auth,GroupController.create)
  .delete(auth,GroupController.deleteallbreeder)
  .get(auth,GroupController.getallbreeder)


router.route('/all')
  .delete(adminauth,GroupController.deleteall)
  .get(adminauth,GroupController.getall)


//for see/delete/update group by id
router.route('/:id').get(auth,GroupController.getbyId)
  .delete(auth,GroupController.deletebyId)
.patch(auth,GroupController.updatebyId)

module.exports=router