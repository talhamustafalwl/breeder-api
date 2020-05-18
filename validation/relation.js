const Validator = require("validator");
const isEmpty = require("is-empty");

function validateRelationInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.otherAnimalId = !isEmpty(data.otherAnimalId) ? data.otherAnimalId : "";
  data.relationName = !isEmpty(data.relationName) ? data.relationName : "";

  // animalId checks
  if (Validator.isEmpty(data.relationName)) {
    errors.relationName = "relationName field is required";
  }

 // animalId checks
  if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }

   // otherAnimalId checks
   if (Validator.isEmpty(data.otherAnimalId)) {
    errors.otherAnimalId = "otherAnimalId field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateRelationInput
}