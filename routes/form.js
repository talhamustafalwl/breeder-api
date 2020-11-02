const express = require('express');
const router = express.Router();
const { adminauth } = require('../middleware/adminauth');
const { auth, allowBreeder, authenticateRole, allowEmployee, allowAdmin } = require('../middleware/auth');
const FormController = require('../controller/form.controller');


router.get('/all/forms', auth, allowBreeder, allowAdmin, authenticateRole, FormController.getForms);
router.get('/byBreeder', auth, allowBreeder,allowEmployee, authenticateRole, FormController.getRegisteredFormsOfBreeder);

router.get('/category/:categoryId', FormController.getFormByCategory)
.get('/', auth, allowBreeder, allowAdmin, authenticateRole, FormController.getAllForms)
    .post('/', auth, allowAdmin, authenticateRole, FormController.addForm)
    .put('/:id', auth, allowAdmin, authenticateRole, FormController.modifyForm)
    .delete('/category/:categoryId/:id', auth, allowBreeder, allowAdmin, allowEmployee, authenticateRole, FormController.deleteFormByCategory);


// router.delete('/:id/breeder/:breederId', FormController.excludeBreederForm)

router.put('/modify/values', auth, allowBreeder, authenticateRole, FormController.modifyValuesRequest);

module.exports = router;
