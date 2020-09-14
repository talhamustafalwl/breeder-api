const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const ImageController = require('../controller/image.controller');
const {upload} = require("../middleware/multerimage")


//for admin  viewall/delete all images of animal
router.route('/all').get(adminauth, ImageController.getall)
  .delete(adminauth, ImageController.deleteall)


//for image crud
router.route('/:id')
  .get(auth, ImageController.getImageAnimal)
  .delete(auth, ImageController.deleteImageAnimal)

router.route('/animal')
  .post(auth, upload.single('file'), ImageController.addImageAnimal)

module.exports = router