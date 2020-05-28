const Validator = require("validator");
const isEmpty = require("is-empty");

function validateNotificationInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.type = !isEmpty(data.type) ? data.type : "";
  data.description = !isEmpty(data.description) ? data.description : "";


 // type checks
  if (Validator.isEmpty(data.type)) {
    errors.type = "type field is required";
  }

   // description checks
   if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateNotificationInput
}