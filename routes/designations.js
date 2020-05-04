const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const DesignationController = require('../controller/designation.controller');

//create,delete designation only by breeder
router.post("/",auth,DesignationController.create)

router.route('/all').delete(auth,DesignationController.deleteall)
  .get(auth,DesignationController.getall)


//for see/delete/update designation by id
router.route('/:id').get(auth,DesignationController.getbyId)
  .delete(auth,DesignationController.deletebyId)
.patch(auth,DesignationController.updatebyId)

module.exports=router