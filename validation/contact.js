const Validator = require("validator");
const isEmpty = require("is-empty");

function validateContact(data) {
    let errors = {};
    // name:{type:String},
    // lastName:{type:String},
    // businessName:{type:String},
    // address: {type: String},
    // email: {type: String},
    // phone: {type: String},
    // category: {type: String},

    data.name = data.name ? data.name : '';
    data.address = data.address ? data.address : '';
    data.category = data.category ? data.category : '';


console.log(data);
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }
    if(Validator.isEmpty(data.address)) {
        errors.address = 'Address is required';
    }
    if(Validator.isEmpty(data.category)) {
        errors.category = 'Category is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}


module.exports = {validateContact};