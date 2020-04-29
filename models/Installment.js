const mongoose = require('mongoose');

//for Installment
const InstallmentSchema = mongoose.Schema({
    installmentNo: {
        type: Number
    },
    amount: {
        type: Number
    },
    reminder: {
        type: Date
    },
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'} ,//belongs to which breeder
    invoiceId: {type: Schema.Types.ObjectId,
        ref: 'Invoice'} 
}, { timestamps: true })


const Installment = mongoose.model('Installment', InstallmentSchema);

module.exports = { Installment }