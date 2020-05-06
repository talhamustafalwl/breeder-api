const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const SubscriptionController = require('../controller/subscription.controller');


router.route('/').post(adminauth,SubscriptionController.create)
  .delete(adminauth,SubscriptionController.deleteall)
  .get(auth,SubscriptionController.getall)


//for see/delete/update subscription by id
router.route('/:id').get(auth,SubscriptionController.getbyId)
  .delete(adminauth,SubscriptionController.deletebyId)
.patch(adminauth,SubscriptionController.updatebyId)

module.exports=router