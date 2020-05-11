const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const { animalsubscriber } = require("../middleware/animalsubscriber");
const AnimalController = require('../controller/animal.controller');


//for admin crud can view all/delete all
router.route('/all').get(adminauth, AnimalController.getall)
  .delete(adminauth,AnimalController.deleteall)



//for breeder  animals crud can view/delete all (can only see his animals)
router.route('/').get(auth,AnimalController.getBreederAnimals)
  .delete(auth,AnimalController.deleteBreederAnimals)
  .post(auth,animalsubscriber,AnimalController.addBreederAnimals)



//for specific animal update/view/delete 
router.route('/:id').get(auth,AnimalController.getanimal)
  .delete(auth,AnimalController.deleteanimal)
.patch(auth,AnimalController.updateanimal)



module.exports=router