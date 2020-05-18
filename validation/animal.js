const Validator = require("validator");
const isEmpty = require("is-empty");

function validateAnimalInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.categoryName = !isEmpty(data.categoryName) ? data.categoryName : "";
  data.color = !isEmpty(data.color) ? data.color : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.acquired = !isEmpty(data.acquired) ? data.acquired : "";
  data.locationId = !isEmpty(data.locationId) ? data.locationId : "";
  data.name = !isEmpty(data.name) ? data.name : "";

  // categoryName checks
  if (Validator.isEmpty(data.categoryName)) {
    errors.categoryName = "categoryName field is required";
  }
 // color checks
  if (Validator.isEmpty(data.color)) {
    errors.color = "color field is required";
  }

    // status checks
    if (Validator.isEmpty(data.status)) {
      errors.status = "status field is required";
    }
   // acquired checks
    if (Validator.isEmpty(data.acquired)) {
      errors.acquired = "acquired field is required";
    }

      // status checks
      if (Validator.isEmpty(data.name)) {
        errors.name = "name field is required";
      }
     // acquired checks
      if (Validator.isEmpty(data.locationId)) {
        errors.locationId = "locationId field is required";
      }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};

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
    validateImageInput,validateVideoInput,validateAnimalInput
};