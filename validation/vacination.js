const Validator = require("validator");
const isEmpty = require("is-empty");

function validateVacinationInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.unitName = !isEmpty(data.unitName) ? data.unitName : "";
  data.rotationName = !isEmpty(data.rotationName) ? data.rotationName : "";
 // name checks
 if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

   // animalId checks
   if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }

 // unitName checks
  if (Validator.isEmpty(data.unitName)) {
    errors.unitName = "unitName field is required";
  }

   // zipcode checks
   if (Validator.isEmpty(data.rotationName)) {
    errors.rotationName = "rotationName field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


function validateVacinationAnimalInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.vacinationId = !isEmpty(data.vacinationId) ? data.vacinationId : "";
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.description = !isEmpty(data.description) ? data.description : "";
 // vacinationId checks
 if (Validator.isEmpty(data.vacinationId)) {
    errors.vacinationId = "vacinationId field is required";
  }

   // animalId checks
   if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }

 // description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateVacinationInput , validateVacinationAnimalInput
}