const express = require('express');
const router = express.Router();
const { auth, allowBreeder, allowEmployee, authenticateRole } = require("../middleware/auth");
//const { adminauth } = require("../middleware/adminauth");
const ProductController = require('../controller/product.controller');
const {upload} = require('../middleware/multerimage');

router.route('/')
  .post(auth, allowBreeder, authenticateRole , upload.single('file'), ProductController.create)
  .delete(auth,ProductController.deleteallbreeder)
  .get(auth, allowBreeder, allowEmployee, authenticateRole,ProductController.getallbreeder)


//for see/delete/update product by id
router.route('/:id').get(auth, allowBreeder, allowEmployee, authenticateRole, ProductController.getbyId)
  .delete(auth, allowBreeder, allowEmployee, authenticateRole,ProductController.deletebyId)
.patch(auth,ProductController.updatebyId)
router.post('/gallery/upload', auth, allowBreeder, allowEmployee, authenticateRole, upload.array('file', 10),  ProductController.uploadGalleryImage )

module.exports=router