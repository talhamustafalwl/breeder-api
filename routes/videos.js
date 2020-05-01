const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const VideoController = require('../controller/video.controller');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == 'video/mp4') {
        cb(null, true);
      } else {
        cb(null, false);
        //return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
   })
   


//for admin  viewall/delete all images of animal
router.route('/all').get(adminauth, VideoController.getall)
  .delete(adminauth,VideoController.deleteall)


//for image crud
router.route('/:id')
  .get(auth,VideoController.getVideoAnimal)
  .delete(auth,VideoController.deleteVideoAnimal)
  
router.route('/animal')
  .post(auth,upload.single('file'),VideoController.addVideoAnimal)

module.exports=router