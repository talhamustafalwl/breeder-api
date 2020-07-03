const Validator = require("validator");
const isEmpty = require("is-empty");


function validateAddForm(body) {
    let errors = {};
    
    body.categoryId = !isEmpty(body.categoryId) ? body.categoryId : "";
   
  
    if ( body.formStructure[0]) {
        console.log(body.formStructure[0]);
        body.formStructure[0].displayName = !isEmpty(body.formStructure[0].displayName) ? body.formStructure[0].displayName : "";
        body.formStructure[0].name = !isEmpty(body.formStructure[0].name) ? body.formStructure[0].name : "";
        body.formStructure[0].type = !isEmpty(body.formStructure[0].type) ? body.formStructure[0].type : "";
        if (!body.formStructure[0].displayName) {
            errors.formStructure = {};
            errors.formStructure.displayName = "Display Name field is required";
        }
       
        if (!body.formStructure[0].name) {
            errors.formStructure = {};
            errors.formStructure.name = "Name field is required";
        }
        if (!body.formStructure[0].type) {
            errors.formStructure = {};
            errors.formStructure.type = "Type field is required";
        }
    } else {
        body.formStructure = "";
    }

    if (Validator.isEmpty(body.categoryId)) {
        errors.categoryId = "Category Id field is required";
    }
    
  
    if (!(body.formStructure)) {
        errors.formStructure = "Form Structure field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = {
    validateAddForm
}