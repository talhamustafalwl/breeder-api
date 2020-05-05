const Validator = require("validator");
const isEmpty = require("is-empty");

function validateCleaningInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.rotationName = !isEmpty(data.rotationName) ? data.rotationName : "";
  data.name = !isEmpty(data.name) ? data.name : "";

  // rotationName checks
  if (Validator.isEmpty(data.rotationName)) {
    errors.rotationName = "rotationName field is required";
  }
 // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  

  return {
    errors,
    isValid: isEmpty(errors)
  };
};




function validateCleaningAnimalInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.rotationName = !isEmpty(data.rotationName) ? data.rotationName : "";
  data.cleaningName = !isEmpty(data.cleaningName) ? data.cleaningName : "";
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.empId = !isEmpty(data.empId) ? data.empId : "";

  // rotationName checks
  if (Validator.isEmpty(data.rotationName)) {
    errors.rotationName = "rotationName field is required";
  }
 // cleaningName checks
  if (Validator.isEmpty(data.cleaningName)) {
    errors.cleaningName = "cleaningName field is required";
  }


  // animalId checks
  if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }
 // empId checks
  if (Validator.isEmpty(data.empId)) {
    errors.empId = "empId field is required";
  }
  

  return {
    errors,
    isValid: isEmpty(errors)
  };
};



module.exports = {
    validateCleaningInput, validateCleaningAnimalInput
};