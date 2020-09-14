const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth, allowBreeder, authenticateRole } = require("../middleware/auth");
const { animalsubscriber } = require("../middleware/animalsubscriber");
const AnimalController = require('../controller/animal.controller');
const {upload, uploadDocument} = require('../middleware/multerimage');



router.get('/test', (req, res) => {
  console.log('test route')
  res.status(200).send('ol')
})

router.post('/gallery/upload', auth, allowBreeder, authenticateRole, upload.array('file'),  AnimalController.uploadGalleryImage )


// router.get('/downloadFile', (req, res )=> {
//   console.log('download file');
//   return res.sen('http://localhost:5000/uploads/documents/1600069663450-Fullstack Web Developer MEAN Stack.pdf');
// })

//for admin crud can view all/delete all
router.route('/all').get(adminauth, AnimalController.getall)
  .delete(adminauth,AnimalController.deleteall)



//for breeder  animals crud can view/delete all (can only see his animals)
router.route('/').get(auth, allowBreeder, authenticateRole, AnimalController.getBreederAnimals)
  .delete(auth, allowBreeder, authenticateRole, AnimalController.deleteBreederAnimals)
  .post(auth, allowBreeder, authenticateRole, upload.single('file'), AnimalController.addBreederAnimals)

  // router.delete('/:id', auth, allowBreeder, authenticateRole, AnimalController.deleteAnimal);


//for specific animal update/view/delete 
router.route('/:id').get(auth, allowBreeder, authenticateRole,AnimalController.getanimal)
  .delete(auth, allowBreeder, authenticateRole,AnimalController.deleteanimal)
.patch(auth,AnimalController.updateanimal)


router.post('/healthrecord/upload',auth, allowBreeder, authenticateRole, uploadDocument.single('file'), AnimalController.uploadHealthRecord)

router.get('/healthrecord/:id', AnimalController.getHealthRecord);


module.exports=router