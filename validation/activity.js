const Validator = require("validator");
const isEmpty = require("is-empty");

function validateActivity(data) {
    let errors = {};

    data.name = data.name ? data.name : '';
    data.description = data.description ? data.description : '';
    data.categoryName = data.categoryName ? data.categoryName : '';


console.log(data);
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }
    if(Validator.isEmpty(data.description)) {
        errors.description = 'Description is required';
    }
    if(Validator.isEmpty(data.categoryName)) {
        errors.categoryName = 'Category is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}


module.exports = {validateActivity};