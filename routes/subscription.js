const express = require('express');
const router = express.Router();
const { auth, allowAdmin, authenticateRole, allowBreeder, allowEmployee } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const SubscriptionController = require('../controller/subscription.controller');

const {upload} = require('../middleware/multerimage');

router.route('/').post(auth, allowAdmin, authenticateRole, upload.single('file'), SubscriptionController.create)
  .delete(auth, allowAdmin, allowBreeder, authenticateRole,SubscriptionController.deleteall)
  .get(SubscriptionController.getall)

router.route('/minimum').get(SubscriptionController.getallTypesMin)
router.route('/packageByType/:packageType').get(SubscriptionController.packageByType)

//for see/delete/update subscription by id
router.route('/:id').get(auth,SubscriptionController.getbyId)
  .delete(auth, allowAdmin, allowBreeder, authenticateRole,SubscriptionController.deletebyId)
.patch(auth, allowAdmin, authenticateRole, upload.single('file'), SubscriptionController.updatebyId)

module.exports=router