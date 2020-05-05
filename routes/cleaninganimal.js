const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const CleaningAnimalController = require('../controller/cleaningAnimal.controller');

//create,delete cleaning (specific)
router.route('/').post(auth,CleaningAnimalController.create)
    .delete(auth,CleaningAnimalController.deleteallbreeder)
    .get(auth,CleaningAnimalController.getallbreeder)

//only by admin
router.route('/all').delete(adminauth,CleaningAnimalController.deleteall)
  .get(adminauth,CleaningAnimalController.getall)


//for see/delete/update cleaning by id
router.route('/:id').get(auth,CleaningAnimalController.getbyId)
    .delete(auth,CleaningAnimalController.deletebyId)
    .patch(auth,CleaningAnimalController.updatebyId)

module.exports=router