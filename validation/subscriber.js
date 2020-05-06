const Validator = require("validator");
const isEmpty = require("is-empty");

function validateSubscriberInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.subscriptionId = !isEmpty(data.subscriptionId) ? data.subscriptionId : "";
 // subscriptioId checks
  if (Validator.isEmpty(data.subscriptionId)) {
    errors.subscriptionId = "subscriptionId field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateSubscriberInput
}