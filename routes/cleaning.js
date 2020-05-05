const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const CleaningController = require('../controller/cleaning.controller');

//create,delete cleaning 
router.route('/').post(auth,CleaningController.create)
    .delete(auth,CleaningController.deleteall)
    .get(auth,CleaningController.getall)

//only by admin
router.route('/all').delete(adminauth,CleaningController.deleteall)
  .get(adminauth,CleaningController.getall)


//for see/delete/update cleaning by id
router.route('/:id').get(auth,CleaningController.getbyId)
    .delete(auth,CleaningController.deletebyId)
    .patch(auth,CleaningController.updatebyId)

module.exports=router