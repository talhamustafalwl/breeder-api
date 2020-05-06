const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const VacinationAnimalController = require('../controller/vacinationanimal.controller');


router.route('/').post(auth,VacinationAnimalController.create)
  .delete(auth,VacinationAnimalController.deleteallbreeder)
  .get(auth,VacinationAnimalController.getallbreeder)

//admin
router.route('/all')
  .delete(adminauth,VacinationAnimalController.deleteall)
  .get(adminauth,VacinationAnimalController.getall)


//for see/delete/update VacinationAnimal by id
router.route('/:id').get(auth,VacinationAnimalController.getbyId)
  .delete(auth,VacinationAnimalController.deletebyId)
.patch(auth,VacinationAnimalController.updatebyId)

module.exports=router