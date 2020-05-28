const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
//const { adminauth } = require("../middleware/adminauth");
const ProductController = require('../controller/product.controller');


router.route('/')
  .post(auth,ProductController.create)
  .delete(auth,ProductController.deleteallbreeder)
  .get(auth,ProductController.getallbreeder)


//for see/delete/update product by id
router.route('/:id').get(auth,ProductController.getbyId)
  .delete(auth,ProductController.deletebyId)
.patch(auth,ProductController.updatebyId)

module.exports=router