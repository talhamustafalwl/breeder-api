const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, authenticateRole,allowEmployee, allowAdmin } = require("../middleware/auth");
const { animalsubscriber } = require("../middleware/animalsubscriber");
const AnimalController = require('../controller/animal.controller');
const {upload, uploadDocument} = require('../middleware/multerimage');
const { checkSubscriptionLimit } = require('../middleware/subscriptionLimit');
const { autoCharge } = require('../middleware/autoCharge');

// const cloudinary = require('cloudinary').v2;
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// cloudinary.config({
//   cloud_name: "talhalwl",
//   api_key: "788391857541918",
//   api_secret: "KL2Nt7eOLGlEkaZl3NU08z1LeAk"
// });
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'logly',
//     resource_type: 'video',
//     format: async (req, file) => {
//       console.log(file,"<--file");
//     },
//     transformation:{width:0.3},
//   },
  
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(' ').join('_');
//     callback(undefined, name);
//   }
// });


router.post('/test', (req, res) => {
  console.log('test route',req.body)
  res.status(200).send('ol')
})

router.post('/gallery/upload', auth, allowBreeder, allowEmployee, authenticateRole, upload.array('file', 10),  AnimalController.uploadGalleryImage )
router.put('/gallery/delete', auth, allowBreeder, allowEmployee, authenticateRole, AnimalController.deleteGallaryImage)
router.get('/qrcode/:id', AnimalController.getQRCodeOfAnimal);
// router.get('/downloadFile', (req, res )=> {
//   console.log('download file');
//   return res.sen('https://breeder-api.herokuapp.com/uploads/documents/1600069663450-Fullstack Web Developer MEAN Stack.pdf');
// })

//for admin crud can view all/delete all
router.route('/all').get(auth, allowAdmin, allowBreeder, authenticateRole, AnimalController.getall)
  .delete(adminauth,AnimalController.deleteall)


//for breeder  animals crud can view/delete all (can only see his animals)
router.route('/').get(auth, allowBreeder,allowEmployee, authenticateRole, AnimalController.getBreederAnimals)
  .delete(auth, allowBreeder, authenticateRole, AnimalController.deleteBreederAnimals)
  .post(auth, allowBreeder, allowEmployee, authenticateRole, (req, res, next) => { req.type='animal'; return next();}, checkSubscriptionLimit,  upload.single('file'), AnimalController.addBreederAnimals)

  // router.delete('/:id', auth, allowBreeder, authenticateRole, AnimalController.deleteAnimal);


router.put('/update/:id', auth, allowBreeder, allowEmployee, authenticateRole, AnimalController.updateAnimalData); 

//for specific animal update/view/delete 
router.route('/:id').get(AnimalController.getanimal)
  .delete(auth, allowBreeder, allowEmployee, allowAdmin, authenticateRole,AnimalController.deleteanimal)
.patch(auth, allowBreeder, allowEmployee, authenticateRole, upload.single('file'),AnimalController.updateanimal)


router.post('/healthrecord/upload',auth, allowBreeder, allowEmployee, authenticateRole,autoCharge, uploadDocument.single('file'), AnimalController.uploadHealthRecord)

router.get('/healthrecord/:id', AnimalController.getHealthRecord);
router.delete('/:animalId/healthrecord/:id', AnimalController.deleteAnimalHealthRecord);

router.delete('/:id/parent/:parentName', AnimalController.removeAnimalParent)
router.delete('/:id/child/:childId', AnimalController.removeAnimalChild)

router.put('/addasparentchild', AnimalController.addAnimalAsParentChild)
router.post('/transferanimal', AnimalController.transferAnimal);

module.exports=router