const Validator = require("validator");
const isEmpty = require("is-empty");

function validateContact(data) {
    let errors = {};
    // firstName:{type:String},
    // lastName:{type:String},
    // businessName:{type:String},
    // address: {type: String},
    // email: {type: String},
    // phone: {type: String},
    // contactType: {type: String},

    data.firstName = data.firstName ? data.firstName : '';
    data.lastName = data.lastName ? data.lastName : '';
    data.businessName = data.businessName ? data.businessName : '';
    data.address = data.address ? data.address : '';
    data.email = data.email ? data.email : '';
    data.phone = data.phone ? data.phone : '';
    data.contactType = data.contactType ? data.contactType : '';


console.log(data);
    if(Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First Name is required';
    }
    if(Validator.isEmpty(data.lastName)) {
        errors.lastName = 'Last Name is required';
    }
    if(Validator.isEmpty(data.businessName)) {
        errors.businessName = 'Business Name is required';
    }
    if(Validator.isEmpty(data.address)) {
        errors.address = 'Address is required';
    }
    if(Validator.isEmpty(data.email)) {
        errors.email= 'Email is required';
    }
    if(Validator.isEmpty(data.phone)) {
        errors.phone = 'Phone is required';
    }

    console.log(errors);

    return {
        errors,
        isValid: isEmpty(errors),
    }
}


module.exports = {validateContact};