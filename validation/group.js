const Validator = require("validator");
const isEmpty = require("is-empty");

function validateGroupInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  // data.locationId = !isEmpty(data.locationId) ? data.locationId : "";
  data.animals = data.animals ? data.animals : "";
  data.employees = data.employees ? data.employees : "";
  console.log(data.employees);
  // name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  // zipcode checks
  //  if (Validator.isEmpty(data.locationId)) {
  //   errors.locationId = "locationId field is required";
  // }

  if (!data.animals) {
    errors.animals = "Animals field is required";
  }
  if (!data.employees) {
    errors.employees = "Employees field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validateGroupLogInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
  data.groupId = !isEmpty(data.groupId) ? data.groupId : "";
  //data.employeeId = !isEmpty(data.employeeId) ? data.employeeId : "";

  // name checks
  if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }

  // zipcode checks
  if (Validator.isEmpty(data.groupId)) {
    errors.groupId = "groupId field is required";
  }

  // employeeId checks
  //if (Validator.isEmpty(data.employeeId)) {
  // errors.employeeId = "employeeId field is required";
  //}

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  validateGroupInput,
  validateGroupLogInput,
};
