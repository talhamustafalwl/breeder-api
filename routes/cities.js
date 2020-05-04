const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const CityController = require('../controller/city.controller');

//create,delete city only by admin
router.post("/",adminauth,CityController.create)

router.route('/all').delete(adminauth,CityController.deleteall)
  .get(auth,CityController.getall)


//for see/delete/update city by id
router.route('/:id').get(auth,CityController.getbyId)
  .delete(auth,CityController.deletebyId)
.patch(auth,CityController.updatebyId)

module.exports=router