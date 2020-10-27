const Validator = require("validator");
const isEmpty = require("is-empty");

function validateSubscriptionInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.allowedAnimal = !isEmpty(data.allowedAnimal) ? data.allowedAnimal : "";
  data.allowedEmp = !isEmpty(data.allowedEmp) ? data.allowedEmp : "";
  data.monthlyPrice = !isEmpty(data.monthlyPrice) ? data.monthlyPrice : "";
  data.yearlyPrice = !isEmpty(data.yearlyPrice) ? data.yearlyPrice : "";

  data.allowedProduct = !isEmpty(data.allowedProduct)
    ? data.allowedProduct
    : "";

  // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }
  // description
  if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }

  // allowedAnimal checks
  if (Validator.isEmpty(data.allowedAnimal)) {
    errors.allowedAnimal = "allowedAnimal field is required";
  }
  if (!Validator.isDecimal(data.allowedAnimal)) {
    errors.allowedAnimal = "allowedAnimal can only contain Number";
  }

  if (Validator.isEmpty(data.allowedProduct)) {
    errors.allowedProduct = "allowedProduct field is required";
  }

  if (!Validator.isDecimal(data.allowedProduct)) {
    errors.allowedProduct = "allowedProduct can only contain Number";
  }

  // allowedEmp checks
  if (Validator.isEmpty(data.allowedEmp)) {
    errors.allowedEmp = "allowedEmp field is required";
  }
  if (!Validator.isDecimal(data.allowedEmp)) {
    errors.allowedEmp = "allowedEmp can only contain Number";
  }



  // price checks
  if (Validator.isEmpty(data.monthlyPrice)) {
    errors.monthlyPrice = "monthlyPrice field is required";
  }
  if (!Validator.isDecimal(data.monthlyPrice)) {
    errors.monthlyPrice = "monthlyPrice can only contain Number";
  }


    // price checks
    if (Validator.isEmpty(data.yearlyPrice)) {
      errors.yearlyPrice = "yearlyPrice field is required";
    }
    if (!Validator.isDecimal(data.yearlyPrice)) {
      errors.yearlyPrice = "yearlyPrice can only contain Number";
    }


  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  validateSubscriptionInput,
};
