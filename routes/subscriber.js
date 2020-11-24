const express = require('express');
const router = express.Router();
const { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const SubscriberController = require('../controller/subscriber.controller');

const { Transaction } = require("../models/Subscription/Transaction");
//stripe
router.route('/stripe').post(auth,SubscriberController.createstripe)
//paypal
router.route('/paypal').post(auth,SubscriberController.createpaypal)

router.post('/breeder', auth, allowBreeder, authenticateRole, SubscriberController.subscribeBreeder );

router.route('/').post(auth,SubscriberController.subscribeUser)

//for new breeder (default package)
router.route('/default').post(auth,SubscriberController.createdefault)





// Test routes
router.get('/createCard', SubscriberController.createCard);


router.route('/all')
  .delete(adminauth,SubscriberController.deleteall)
  .get(adminauth,SubscriberController.getall)


//for see/delete/update subscriber by id
router.route('/:id').get(auth,SubscriberController.getbyId)
  .delete(adminauth,SubscriberController.deletebyId)
.patch(adminauth,SubscriberController.updatebyId)

router.get('/getSubscribedPackage/:id', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, SubscriberController.getSubscribedPackageOfBreeder)

router.get('/check' , (req, res) => {
  console.log(req.url);
  res.send('OK')
});

module.exports=router