const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, allowAdmin, authenticateRole } = require("../middleware/auth");
const CategoryController = require('../controller/category.controller');

//create,delete category only by admin
router.post("/", CategoryController.create)

router.route('/all').delete(adminauth, CategoryController.deleteall)
  .get(CategoryController.getall)


//for see/delete/update category by id
router.route('/:id').get(auth,CategoryController.getbyId)
  .delete(adminauth,CategoryController.deletebyId)
.patch(auth, allowBreeder, allowAdmin, authenticateRole,CategoryController.updatebyId)

module.exports=router