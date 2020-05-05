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


module.exports = {
    validateCleaningInput
};