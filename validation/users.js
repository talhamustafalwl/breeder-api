const Validator = require("validator");
const isEmpty = require("is-empty");
const { roles } = require('../config/roles');


function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.role = !isEmpty(data.role) ? data.role : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!Validator.isIn(data.role, roles)) {
    errors.role = "Invalid Role";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // if (Validator.isEmpty(data.password2)) {
  //   errors.password2 = "Confirm password field is required";
  // }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = "Passwords must match";
  // }



  return {
    errors,
    isValid: isEmpty(errors)
  };
};


function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.role = !isEmpty(data.role) ? data.role: "" ;

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // Role checks
  if (Validator.isEmpty(data.role)) {
    errors.role = "Role field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

function validateRegisterInputBreeder(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.city = !isEmpty(data.city) ? data.city : '';
  data.state = !isEmpty(data.state) ? data.state : '';
  // data.businessName = !isEmpty(data.businessName) ? data.businessName : '';
  // data.noOfEmployees = !isEmpty(data.noOfEmployees) ? data.noOfEmployees : '';


  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone field is required";
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = "City field is required";
  }

  if (Validator.isEmpty(data.state)) {
    errors.state = "State field is required";
  }

  // if (Validator.isEmpty(data.businessName)) {
  //   errors.businessName = "Business Name field is required";
  // }

  // if (Validator.isEmpty(data.noOfEmployees)) {
  //   errors.noOfEmployees = "No of Employees field is required";
  // }


  return {
    errors,
    isValid: isEmpty(errors)
  };

}


function validateResetPassword(data) {
  let errors = {};

  // Convert empty fields to an empty string
  data.password = !isEmpty(data.password) ? data.password : "";


  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}

////////for employee
function validateRegisterInputEmp(data) {
  let errors = {};
  console.log(data);
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.phone = !isEmpty(data.phone.toString()) ? data.phone : "";

  // data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // data.appointmentDate = !isEmpty(data.appointmentDate) ? data.appointmentDate : "";
  // data.breederId = !isEmpty(data.breederId) ? data.breederId : "";
  // data.farmId = !isEmpty(data.farmId) ? data.farmId : "";
  // data.designationName = !isEmpty(data.designationName) ? data.designationName : "";

  if (data.canAccessMobileApp === undefined) {
    errors.canAccessMobileApp = "Can Access Mobile App field is required";
  }
  if (data.canAccessInventoryManagement === undefined) {
    errors.canAccessInventoryManagement = "Can Access Inventory Management field is required";
  }
  if (data.active === undefined) {
    errors.active = "Active field is required";
  }

  if (Validator.isEmpty(data.phone.toString())) {
    errors.phone = "Phone field is required";
  }

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }



  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = "Passwords muvalidateRegisterInputst match";
  // }


  // // appointmentDate 
  // if (Validator.isEmpty(data.appointmentDate)) {
  //   errors.appointmentDate = "appointmentDate field is required";
  // }

  // breederId 
  // if (Validator.isEmpty(data.breederId)) {
  //   errors.breederId = "breederId field is required";
  // }

  // // farmId 
  // if (Validator.isEmpty(data.farmId)) {
  //   errors.farmId = "farmId field is required";
  // }

  // designationName 
  // if (Validator.isEmpty(data.designationName)) {
  //   errors.designationName = "designationName field is required";
  // }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};


module.exports = {
  validateLoginInput, validateRegisterInput, validateRegisterInputEmp, validateRegisterInputBreeder, validateResetPassword
};