const Validator = require("validator");
const isEmpty = require("is-empty");

function validateBusinessInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.street1 = !isEmpty(data.street1) ? data.street1 : "";
  data.street2 = !isEmpty(data.street2) ? data.street2 : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.zipcode = !isEmpty(data.zipcode) ? data.zipcode : "";
  data.email = !isEmpty(data.email) ? data.email : "";

 // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

   // zipcode checks
   if (Validator.isEmpty(data.street1)) {
    errors.street1 = "street1 field is required";
  }

   // street2 checks
   if (Validator.isEmpty(data.street2)) {
    errors.street2 = "street2 field is required";
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


  // email checks
  if (Validator.isEmpty(data.email)) {
     errors.email = "email field is required";
   } else if (!Validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateBusinessInput
}