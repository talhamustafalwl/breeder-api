const Validator = require("validator");
const isEmpty = require("is-empty");

function validateHealthInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.detail = !isEmpty(data.detail) ? data.detail : "";
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";

 // detail checks
  if (Validator.isEmpty(data.detail)) {
    errors.detail = "detail field is required";
  }

   // zipcode checks
   if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateHealthInput
}