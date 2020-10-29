const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, allowAdmin, allowEmployee, authenticateRole } = require("../middleware/auth");
const CategoryController = require('../controller/category.controller');
const {uploadCategory} = require('../middleware/multerimage');


//create,delete category only by admin
router.post("/", auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, uploadCategory.single('file'), CategoryController.create)

router.put('/addtype/:id', CategoryController.addType)

router.route('/all').delete(adminauth, CategoryController.deleteall)
  .get(auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, CategoryController.getall)



//for see/delete/update category by id
router.route('/:id').get(auth,CategoryController.getbyId)
  .delete(auth, allowBreeder, allowAdmin, authenticateRole ,CategoryController.deletebyId)
.patch(auth, allowBreeder, allowAdmin, authenticateRole,CategoryController.updatebyId)

router.patch('/update/:id', auth, allowAdmin, authenticateRole, uploadCategory.single('file'), CategoryController.updateCategoryById);


// Inventory Section
// #####################
router.get('/inventory/:breederId', CategoryController.getInventoryByBreeder);


module.exports=router