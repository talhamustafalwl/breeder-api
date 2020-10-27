const express = require('express');
const router = express.Router();
const { auth, allowAdmin, authenticateRole, allowBreeder, allowEmployee } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const SubscriptionController = require('../controller/subscription.controller');

const {upload} = require('../middleware/multerimage');

router.route('/').post(auth, allowAdmin, authenticateRole, upload.single('file'), SubscriptionController.create)
  .delete(adminauth,SubscriptionController.deleteall)
  .get(auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SubscriptionController.getall)


//for see/delete/update subscription by id
router.route('/:id').get(auth,SubscriptionController.getbyId)
  .delete(adminauth,SubscriptionController.deletebyId)
.patch(adminauth,SubscriptionController.updatebyId)

module.exports=router