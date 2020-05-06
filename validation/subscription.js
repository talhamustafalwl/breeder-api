const Validator = require("validator");
const isEmpty = require("is-empty");

function validateSubscriptionInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.allowedAnimal = !isEmpty(data.allowedAnimal) ? data.allowedAnimal : "";
  data.allowedEmp = !isEmpty(data.allowedEmp) ? data.allowedEmp : "";
  data.period = !isEmpty(data.period) ? data.period : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.currency = !isEmpty(data.currency) ? data.currency : "";

 // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

   // allowedAnimal checks
   if (Validator.isEmpty(data.allowedAnimal)) {
    errors.allowedAnimal = "allowedAnimal field is required";
  }
  if (!Validator.isDecimal(data.allowedAnimal)) {
    errors.allowedAnimal = "allowedAnimal can only contain Number";
  }

    // allowedEmp checks
    if (Validator.isEmpty(data.allowedEmp)) {
        errors.allowedEmp = "allowedEmp field is required";
      }
      if (!Validator.isDecimal(data.allowedEmp)) {
        errors.allowedEmp = "allowedEmp can only contain Number";
      }

         // period checks
   if (Validator.isEmpty(data.period)) {
    errors.period = "period field is required";
  }
  if (!Validator.isDecimal(data.period)) {
    errors.period = "period can only contain Number";
  }

    // price checks
    if (Validator.isEmpty(data.price)) {
        errors.price = "price field is required";
      }      
  if (!Validator.isDecimal(data.price)) {
    errors.price = "price can only contain Number";
  }

       // currency checks
    if (Validator.isEmpty(data.currency)) {
        errors.currency = "currency field is required";
      }
    

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateSubscriptionInput
}