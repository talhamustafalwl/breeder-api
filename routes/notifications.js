const express = require('express');
const router = express.Router();
//const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, allowAdmin, allowEmployee, authenticateRole } = require("../middleware/auth");
const NotificationController = require('../controller/notification.controller');
router.get('/pushNotif', NotificationController.createNotif);


router.route('/').post(auth, allowAdmin, allowEmployee, allowBreeder, authenticateRole, NotificationController.addNotificationUpdated)
    // .get(auth, allowBreeder, allowAdmin, allowEmployee, allowBreeder, authenticateRole, NotificationController.getAll)

//for see/delete/update notification by id
// router.route('/:id').get(auth, NotificationController.getbyId)
//   .delete(auth, NotificationController.deletebyId)
// .patch(auth, NotificationController.updatebyId);


module.exports=router;