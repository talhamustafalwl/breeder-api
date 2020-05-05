const express = require('express');
const router = express.Router();
const { adminauth } = require("../middleware/adminauth");
const { auth } = require("../middleware/auth");
const NoteController = require('../controller/note.controller');

//create,delete note only by admin
router.route('/').post(auth,NoteController.create)
    .delete(auth,NoteController.deleteall)
    .get(auth,NoteController.getall)

router.route('/all').delete(adminauth,NoteController.deleteall)
  .get(adminauth,NoteController.getall)


//for see/delete/update note by id
router.route('/:id').get(auth,NoteController.getbyId)
    .delete(auth,NoteController.deletebyId)
    .patch(auth,NoteController.updatebyId)

module.exports=router