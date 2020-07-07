const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const StateController = require('../controller/state.controller');

//create,delete state only by admin
router.post("/",adminauth,StateController.create)

router.route('/all').delete(adminauth,StateController.deleteall)
  .get(StateController.getall)


//for see/delete/update state by id
router.route('/:id').get(auth,StateController.getbyId)
  .delete(auth,StateController.deletebyId)
.patch(auth,StateController.updatebyId)

module.exports=router