const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const FeedController = require('../controller/feed.controller');

//create,delete feed only by breeder
router.post("/",auth,FeedController.create)

router.route('/all').delete(auth,FeedController.deleteall)
  .get(auth,FeedController.getall)


//for see/delete/update feed by id
router.route('/:id').get(auth,FeedController.getbyId)
  .delete(auth,FeedController.deletebyId)
.patch(auth,FeedController.updatebyId)

module.exports=router