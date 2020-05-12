const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const LocationController = require('../controller/location.controller');


router.route('/').post(auth,LocationController.create)
    .delete(auth,LocationController.deleteallbreeder)
    .get(auth,LocationController.getallbreeder)

router.route('/all').delete(adminauth,LocationController.deleteall)
  .get(adminauth,LocationController.getall)


//for see/delete/update location by id
router.route('/:id').get(auth,LocationController.getbyId)
    .delete(auth,LocationController.deletebyId)
    .patch(auth,LocationController.updatebyId)

module.exports=router