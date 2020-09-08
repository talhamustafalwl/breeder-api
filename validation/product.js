const Validator = require("validator");
const isEmpty = require("is-empty");

function validateProductInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.model = !isEmpty(data.model) ? data.model : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.quantity = !isEmpty(data.quantity) ? data.quantity : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.date = !isEmpty(data.date) ? data.date : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.status = !isEmpty(data.status) ? data.status : "";

 // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  if (Validator.isEmpty(data.date)) {
    errors.date = "date field is required";
  }


  if (Validator.isEmpty(data.category)) {
    errors.category = "category field is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "status field is required";
  }


   // description checks
   if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }


    // quantity checks
    if (Validator.isEmpty(data.quantity)) {
        errors.quantity = "quantity field is required";
      }
         // price checks
    if (Validator.isEmpty(data.price)) {
        errors.price = "price field is required";
      }
      if (Validator.isEmpty(data.model)) {
        errors.model = "model field is required";
      }

      if (!Validator.isDecimal(data.quantity)) {
        errors.quantity = "quantity can only contain Number";
      }
      if (!Validator.isDecimal(data.price)) {
        errors.price = "price can only contain Number";
      }
      if (!Validator.isDecimal(data.model)) {
        errors.model = "model can only contain Number";
      }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
    validateProductInput
}