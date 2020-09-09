const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, authenticateRole } = require("../middleware/auth");
const { animalsubscriber } = require("../middleware/animalsubscriber");
const AnimalController = require('../controller/animal.controller');
const multer = require('../middleware/multerimage');


//for admin crud can view all/delete all
router.route('/all').get(adminauth, AnimalController.getall)
  .delete(adminauth,AnimalController.deleteall)



//for breeder  animals crud can view/delete all (can only see his animals)
router.route('/').get(auth, allowBreeder, authenticateRole, AnimalController.getBreederAnimals)
  .delete(auth, allowBreeder, authenticateRole, AnimalController.deleteBreederAnimals)
  .post(auth, allowBreeder, authenticateRole, multer.single('file'), AnimalController.addBreederAnimals)

  // router.delete('/:id', auth, allowBreeder, authenticateRole, AnimalController.deleteAnimal);


//for specific animal update/view/delete 
router.route('/:id').get(auth, allowBreeder, authenticateRole,AnimalController.getanimal)
  .delete(auth, allowBreeder, authenticateRole,AnimalController.deleteanimal)
.patch(auth,AnimalController.updateanimal)



module.exports=router