const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const AnimalController = require('../controller/animal.controller');


//for admin crud can view all/delete all
router.route('/all').get(adminauth, AnimalController.getall)
  .delete(adminauth,AnimalController.deleteall)

  //for admin   view/delete all (of specific breeder)
router.route('/breeder/:breederId').get(adminauth,AnimalController.getBreederAnimalsAdmin)
.delete(adminauth,AnimalController.deleteBreederAnimalsAdmin)

//for breeder  animals crud can view/delete all (can only see his animals)
router.route('/').get(auth,AnimalController.getBreederAnimals)
  .delete(auth,AnimalController.deleteBreederAnimals)
  .post(auth,AnimalController.addBreederAnimals)



//for specific animal update/view/delete 
router.route('/:id').get(auth,AnimalController.getanimal)
  .delete(auth,AnimalController.deleteanimal)
.patch(auth,AnimalController.updateanimal)



module.exports=router