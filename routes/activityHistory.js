const express  = require('express');
const contactController  = require('../controller/activityHistory.controller');
const router = express.Router();
const { auth, allowAdmin, allowBreeder, authenticateRole, allowEmployee } = require("../middleware/auth");

router.post('/', auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, contactController.create)
.get('/', auth, contactController.getall)
// .get('/getActivityData', auth, allowAdmin, allowBreeder, authenticateRole, contactController.getActivityData)
.get('/group', auth, contactController.getallByType)
// .get('/:id', auth, contactController.getbyId)
.put('/:id', auth, contactController.updatebyId)
// .delete('/:id', auth, contactController.deletebyId)

module.exports = router;