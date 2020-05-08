const Validator = require("validator");
const isEmpty = require("is-empty");

function validateLocationInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.code = !isEmpty(data.code) ? data.code : "";
  data.street = !isEmpty(data.street) ? data.street : "";
  data.zipcode = !isEmpty(data.zipcode) ? data.zipcode : "";

 // city checks
  if (Validator.isEmpty(data.city)) {
    errors.city = "city field is required";
  }

   // state checks
   if (Validator.isEmpty(data.state)) {
    errors.state = "state field is required";
  }
  
    // postal code checks
    if (Validator.isEmpty(data.code)) {
        errors.code = "code field is required";
      }


         // street checks
   if (Validator.isEmpty(data.street)) {
    errors.street = "street field is required";
  }


    // zipcode checks
    if (Validator.isEmpty(data.zipcode)) {
        errors.zipcode = "zipcode field is required";
      }      
  if (!Validator.isDecimal(data.zipcode)) {
    errors.zipcode = "zipcode can only contain Number";
  }

    

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateLocationInput
}