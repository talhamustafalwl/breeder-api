const express = require('express');
const router = express.Router();
//const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const NotificationController = require('../controller/notification.controller');


router.route('/').post(auth,NotificationController.create)
    .get(auth,NotificationController.getAll)

//for see/delete/update notification by id
router.route('/:id').get(auth,NotificationController.getbyId)
  .delete(auth,NotificationController.deletebyId)
.patch(auth,NotificationController.updatebyId)

module.exports=router