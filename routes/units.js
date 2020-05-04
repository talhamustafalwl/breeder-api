const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const UnitController = require('../controller/unit.controller');

//create,delete unit only by admin
router.post("/",adminauth,UnitController.create)

router.route('/all').delete(adminauth,UnitController.deleteall)
  .get(auth,UnitController.getall)


//for see/delete/update unit by id
router.route('/:id').get(auth,UnitController.getbyId)
  .delete(adminauth,UnitController.deletebyId)
.patch(adminauth,UnitController.updatebyId)

module.exports=router