const express = require('express');
const router = express.Router();
//const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const RelationController = require('../controller/relation.controller');


router.route('/')
    .post(auth,RelationController.create)
    .get(auth,RelationController.getAll)

router.route('/animal/:animalId')
    .get(auth,RelationController.getAllAnimalRelation)

//for see/delete/update Relation by id
router.route('/:id').get(auth,RelationController.getbyId)
  .delete(auth,RelationController.deletebyId)
.patch(auth,RelationController.updatebyId)

module.exports=router