const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, authenticateRole,allowEmployee } = require("../middleware/auth");
const { animalsubscriber } = require("../middleware/animalsubscriber");
const AnimalController = require('../controller/animal.controller');
const {upload, uploadDocument} = require('../middleware/multerimage');



router.post('/test', (req, res) => {
  console.log('test route',req.body)
  res.status(200).send('ol')
})

router.post('/gallery/upload', auth, allowBreeder, allowEmployee, authenticateRole, upload.array('file', 10),  AnimalController.uploadGalleryImage )
router.put('/gallery/delete', auth, allowBreeder, allowEmployee, authenticateRole, AnimalController.deleteGallaryImage)

// router.get('/downloadFile', (req, res )=> {
//   console.log('download file');
//   return res.sen('https://breeder-api.herokuapp.com/uploads/documents/1600069663450-Fullstack Web Developer MEAN Stack.pdf');
// })

//for admin crud can view all/delete all
router.route('/all').get(adminauth, AnimalController.getall)
  .delete(adminauth,AnimalController.deleteall)



//for breeder  animals crud can view/delete all (can only see his animals)
router.route('/').get(auth, allowBreeder,allowEmployee, authenticateRole, AnimalController.getBreederAnimals)
  .delete(auth, allowBreeder, authenticateRole, AnimalController.deleteBreederAnimals)
  .post(auth, allowBreeder, allowEmployee, authenticateRole, upload.single('file'), AnimalController.addBreederAnimals)

  // router.delete('/:id', auth, allowBreeder, authenticateRole, AnimalController.deleteAnimal);


//for specific animal update/view/delete 
router.route('/:id').get(auth, allowBreeder, allowEmployee, authenticateRole,AnimalController.getanimal)
  .delete(auth, allowBreeder, allowEmployee, authenticateRole,AnimalController.deleteanimal)
.patch(auth, allowBreeder, allowEmployee, authenticateRole, upload.single('file'),AnimalController.updateanimal)


router.post('/healthrecord/upload',auth, allowBreeder, allowEmployee, authenticateRole, uploadDocument.single('file'), AnimalController.uploadHealthRecord)

router.get('/healthrecord/:id', AnimalController.getHealthRecord);


module.exports=router