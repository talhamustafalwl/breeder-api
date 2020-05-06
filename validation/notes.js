const Validator = require("validator");
const isEmpty = require("is-empty");

function validateNoteInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.note = !isEmpty(data.note) ? data.note : "";
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";


 // note checks
  if (Validator.isEmpty(data.note)) {
    errors.note = "note field is required";
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
    validateNoteInput
}