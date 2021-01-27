const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const FeedbackController = require('../controller/feedback.controller');

router.route('/').post(FeedbackController.create)
.get(adminauth,FeedbackController.getall)

router.route('/:id').get(adminauth,FeedbackController.getbyId)
    .delete(adminauth,FeedbackController.deletebyId)

module.exports=router