const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const FarmController = require('../controller/farm.controller');

//create,delete farm only by breeder
router.post("/",auth,FarmController.create)

router.route('/all').delete(auth,FarmController.deleteall)
  .get(auth,FarmController.getall)


//for see/delete/update farm by id
router.route('/:id').get(auth,FarmController.getbyId)
  .delete(auth,FarmController.deletebyId)
.patch(auth,FarmController.updatebyId)

module.exports=router