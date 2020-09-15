const Validator = require("validator");
const isEmpty = require("is-empty");

function validateProductInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  // data.name = !isEmpty(data.name) ? data.name : "";
  // data.model = !isEmpty(data.model) ? data.model : "";
  // data.description = !isEmpty(data.description) ? data.description : "";
  // data.quantity = !isEmpty(data.quantity) ? data.quantity : "";
  // data.price = !isEmpty(data.price) ? data.price : "";
  // data.date = !isEmpty(data.date) ? data.date : "";
  // data.category = !isEmpty(data.category) ? data.category : "";
  // data.status = !isEmpty(data.status) ? data.status : "";
  data.categoryName = !isEmpty(data.categoryName) ? data.categoryName : "";
  data.categoryId = !isEmpty(data.categoryId) ? data.categoryId : "";
  data.data = data.data ? data.data : "";
  // name checks
  if (Validator.isEmpty(data.categoryName)) {
    errors.categoryName = "categoryName field is required";
  }

  if (Validator.isEmpty(data.categoryId)) {
    errors.categoryId = "categoryId field is required";
  }

  if (!data.data) {
    errors.data = "data field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  validateProductInput,
};
