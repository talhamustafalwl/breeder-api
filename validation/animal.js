const Validator = require("validator");
const isEmpty = require("is-empty");

function validateImageInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.breederId = !isEmpty(data.breederId) ? data.breederId : "";


  // animalId checks
  if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }
 // breederId checks
  if (Validator.isEmpty(data.breederId)) {
    errors.breederId = "breederId field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


function validateVideoInput(data) {
  
    let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.breederId = !isEmpty(data.breederId) ? data.breederId : "";

  
  // animalId checks
  if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }
 // breederId checks
  if (Validator.isEmpty(data.breederId)) {
    errors.breederId = "breederId field is required";
  }
  



    return {
      errors,
      isValid: isEmpty(errors)
    };
  };



  module.exports = {
    validateImageInput,validateVideoInput
};