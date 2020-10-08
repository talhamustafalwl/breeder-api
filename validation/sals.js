const Validator = require("validator");
const isEmpty = require("is-empty");


function validateSales(data) {
    let errors = {};
    let isInstallment = false;
    data.buyerId = data.buyerId ? data.buyerId : '';

    data.animals = data.animals ? data.animals : '';
    data.amount = data.amount ? data.amount : '';
    data.installments = data.installments ? data.installments: '';
    // data.isPaid = !isEmpty(data.isPaid) ? data.isPaid : '';

    if (Validator.isEmpty(data.buyerId)) {
        errors.buyerId = 'Buyer id is required';
    }
    if(!data.animals || !data.animals[0]) {
        errors.animals = 'Animals array is required at least one element!';
    }
    
    if(!(data.amount)) {
        errors.amount = 'Amount is required';
    }
    
    if(data.amount) {
        if(!data.amount.subTotal) errors.amount.subTotal = 'Subtotal Amount is required';
        if(!data.amount.totalAmount) errors.amount.totalAmount = 'Total Amount is required';
    }

    if(!(data.installments) || !data.installments[0]) {
        isInstallment = false;
    } else {
        isInstallment = true;
    }
    // if(data.isPaid === '') {
    //     errors.isPaid = 'Is Paid check is required';
    // }
    console.log(errors);
        
    return {
        errors,
        isValid: isEmpty(errors),
        isInstallment
    };
}

module.exports = {validateSales};