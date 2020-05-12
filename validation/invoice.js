const Validator = require("validator");
const isEmpty = require("is-empty");

function validateInvoiceInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.contactId = !isEmpty(data.contactId) ? data.contactId : "";

 // contactId checks
  if (Validator.isEmpty(data.contactId)) {
    errors.contactId = "contactId field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};





function validateInvoiceItemInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.invoiceId = !isEmpty(data.invoiceId) ? data.invoiceId : "";
    data.animalId = !isEmpty(data.animalId) ? data.animalId : "";
    data.price = !isEmpty(data.price) ? data.price : "";

   // invoiceId checks
    if (Validator.isEmpty(data.invoiceId)) {
      errors.invoiceId = "invoiceId field is required";
    }

       // contactId checks
   if (Validator.isEmpty(data.animalId)) {
    errors.animalId = "animalId field is required";
  }
   // price checks
   if (Validator.isEmpty(data.price)) {
    errors.price = "price field is required";
  }
  if (!Validator.isDecimal(data.price)) {
    errors.price = "price can only contain Number";
  }
  
  
    return {
      errors,
      isValid: isEmpty(errors)
    };
  };



  function validateInstallmentInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.invoiceId = !isEmpty(data.invoiceId) ? data.invoiceId : "";
    data.contactId = !isEmpty(data.contactId) ? data.contactId : "";
    data.amount = !isEmpty(data.amount) ? data.amount : "";
    data.installmentNo = !isEmpty(data.installmentNo) ? data.installmentNo : "";
    
   // invoiceId checks
    if (Validator.isEmpty(data.invoiceId)) {
      errors.invoiceId = "invoiceId field is required";
    }

       // contactId checks
   if (Validator.isEmpty(data.contactId)) {
    errors.contactId = "contactId field is required";
  }
   // amount checks
   if (Validator.isEmpty(data.amount)) {
    errors.amount = "amount field is required";
  }
  if (!Validator.isDecimal(data.amount)) {
    errors.amount = "amount can only contain Number";
  }

   // amount checks
   if (Validator.isEmpty(data.installmentNo)) {
    errors.installmentNo = "installmentNo field is required";
  }
  if (!Validator.isDecimal(data.installmentNo)) {
    errors.installmentNo = "installmentNo can only contain Number";
  }

  
    return {
      errors,
      isValid: isEmpty(errors)
    };
  };

  
module.exports = {
    validateInvoiceInput,validateInvoiceItemInput,validateInstallmentInput
}