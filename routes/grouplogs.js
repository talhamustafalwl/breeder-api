const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const GroupLogController = require('../controller/grouplog.controller');

router.route('/').post(auth,GroupLogController.create)


router.route('/all')
  .delete(auth,GroupLogController.deleteall)
  .get(auth,GroupLogController.getall)


//for see/delete/update group by id
router.route('/:id').get(auth,GroupLogController.getbyId)
  .delete(auth,GroupLogController.deletebyId)
.patch(auth,GroupLogController.updatebyId)

module.exports=router