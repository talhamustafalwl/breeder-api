const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const FeedAnimalController = require('../controller/feedAniml.controller');

//create,delete feedAnimal only by breeder
router.post("/",auth,FeedAnimalController.create)

router.route('/all')
.delete(auth,FeedAnimalController.deleteall)
  .get(auth,FeedAnimalController.getall)


//for see/delete/update feedAnimal by id
router.route('/:id').get(auth,FeedAnimalController.getbyId)
  .delete(auth,FeedAnimalController.deletebyId)
.patch(auth,FeedAnimalController.updatebyId)

module.exports=router