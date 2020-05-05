const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const FeedHistoryController = require('../controller/feedHistory.controller');


router.route('/').post(auth,FeedHistoryController.create)
  .delete(auth,FeedHistoryController.deleteallbreeder)
  .get(auth,FeedHistoryController.getallbreeder)

//admin
router.route('/all')
  .delete(adminauth,FeedHistoryController.deleteall)
  .get(adminauth,FeedHistoryController.getall)


//for see/delete/update feedHistory by id
router.route('/:id').get(auth,FeedHistoryController.getbyId)
  .delete(auth,FeedHistoryController.deletebyId)
.patch(auth,FeedHistoryController.updatebyId)

module.exports=router