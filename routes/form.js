const express = require('express');
const router = express.Router();
const { autoCharge } = require('../middleware/autoCharge');
const { auth, allowBreeder, authenticateRole, allowEmployee, allowAdmin } = require('../middleware/auth');
const FormController = require('../controller/form.controller');


router.delete('/delete/:id', auth,  allowAdmin, authenticateRole, FormController.deleteFormAdmin);
router.get('/all/forms', auth, allowBreeder,allowEmployee, allowAdmin, authenticateRole, FormController.getForms);
router.get('/byBreeder', auth, allowBreeder,allowEmployee, authenticateRole, FormController.getRegisteredFormsOfBreeder);

router.get('/category/:categoryId', FormController.getFormByCategory)
.get('/', auth, allowBreeder, allowAdmin, authenticateRole, FormController.getAllForms)
    .post('/', auth, allowAdmin, authenticateRole, FormController.addForm)
    .put('/:id', auth, allowAdmin,allowBreeder, authenticateRole,autoCharge, FormController.modifyForm)
    .delete('/category/:categoryId/:id', auth, allowBreeder, allowAdmin, allowEmployee, authenticateRole, FormController.deleteFormByCategory);
    


// router.delete('/:id/breeder/:breederId', FormController.excludeBreederForm)

router.put('/modify/values', auth, allowBreeder, authenticateRole, FormController.modifyValuesRequest);
router.get('/modify/values', auth, allowAdmin, authenticateRole, FormController.modifyValuesRequestGet);
router.put('/addItemField/values', auth, allowAdmin, authenticateRole, FormController.modifyValuesRequestAdd);
router.post('/addItemField/values', auth, allowAdmin, authenticateRole,autoCharge, FormController.modifyValuesRequestDelete);
router.delete('/addItemFieldFormId/:id', auth, allowAdmin, authenticateRole, FormController.modifyValuesRequestDeleteFormId);

module.exports = router;
