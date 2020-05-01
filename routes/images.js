const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const ImageController = require('../controller/image.controller');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        //return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
   })
   


//for admin  viewall/delete all images of animal
router.route('/all').get(adminauth, ImageController.getall)
  .delete(adminauth,ImageController.deleteall)


//for image crud
router.route('/:id')
  .get(auth,ImageController.getImageAnimal)
  .delete(auth,ImageController.deleteImageAnimal)
  
router.route('/animal')
  .post(auth,upload.single('file'),ImageController.addImageAnimal)

module.exports=router