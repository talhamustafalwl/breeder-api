const Validator = require("validator");
const isEmpty = require("is-empty");

function validateFeedInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.unitName = !isEmpty(data.unitName) ? data.unitName : "";


 // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

   // zipcode checks
   if (Validator.isEmpty(data.unitName)) {
    errors.unitName = "unitName field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};



function validateFeedAnimalInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.feedId = !isEmpty(data.feedId) ? data.feedId : "";
  data.quantity = !isEmpty(data.quantity) ? data.quantity : "";
  data.description = !isEmpty(data.description) ? data.description : "";


 // name checks
  if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }

   // zipcode checks
   if (Validator.isEmpty(data.feedId)) {
    errors.feedId = "feedId field is required";
  }
  
  if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }

   // quantity checks
   if (Validator.isEmpty(data.quantity)) {
    errors.quantity = "quantity field is required";
  }

    
  if (!Validator.isDecimal(data.quantity)) {
    errors.quantity = "quantity can only contain Number";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateFeedInput,validateFeedAnimalInput
};