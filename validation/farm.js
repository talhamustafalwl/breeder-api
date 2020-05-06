const Validator = require("validator");
const isEmpty = require("is-empty");

function validateFarmInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.categoryId = !isEmpty(data.categoryId) ? data.categoryId : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.zipcode = !isEmpty(data.zipcode) ? data.zipcode : "";

  // categoryId checks
  if (Validator.isEmpty(data.categoryId)) {
    errors.categoryId = "categoryId field is required";
  }
 // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

// city checks
if (Validator.isEmpty(data.city)) {
    errors.city = "city field is required";
  }
 // state checks
  if (Validator.isEmpty(data.state)) {
    errors.state = "state field is required";
  }

   // zipcode checks
   if (Validator.isEmpty(data.zipcode)) {
    errors.zipcode = "zipcode field is required";
  }
  
   if (!Validator.isDecimal(data.zipcode)) {
    errors.zipcode = "zipcode can only contain Number";
  }
  if (!Validator.isLength(data.zipcode, { min: 5, max: 6 })) {
    errors.zipcode = "zipcode range 5-6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateFarmInput
};