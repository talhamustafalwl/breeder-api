const express = require('express');
const router = express.Router();
const { auth, allowBreeder, allowEmployee, authenticateRole } = require("../middleware/auth");
//const { adminauth } = require("../middleware/adminauth");
const ProductController = require('../controller/product.controller');
const {upload} = require('../middleware/multerimage');
const { checkSubscriptionLimit } = require('../middleware/subscriptionLimit');
const { autoCharge } = require("../middleware/autoCharge");

router.route('/')
  .post(auth, allowBreeder, allowEmployee, authenticateRole, (req, res, next) => { req.type='product'; return next();}, checkSubscriptionLimit ,autoCharge,  upload.single('file'), ProductController.create)
  .delete(auth,ProductController.deleteallbreeder)
  .get(auth, allowBreeder, allowEmployee, allowEmployee, authenticateRole,ProductController.getallbreeder)

  router.post('/gallery/upload', auth, allowBreeder, allowEmployee, authenticateRole, upload.array('file', 10),  ProductController.uploadGalleryImage )

//for see/delete/update product by id
router.route('/:id').get(auth, allowBreeder, allowEmployee, authenticateRole,ProductController.getbyId)
router.route('/share/:id').get( ProductController.getbyIdShare)
  .delete(auth, allowBreeder, allowEmployee, authenticateRole,ProductController.deletebyId)
.put(auth, allowBreeder, allowEmployee, authenticateRole, upload.single('file'),ProductController.updatebyId)
router.post('/gallery/upload', auth, allowBreeder, allowEmployee, authenticateRole,autoCharge,  upload.array('file', 10),  ProductController.uploadGalleryImage )

module.exports=router