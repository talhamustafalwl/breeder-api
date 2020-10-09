const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for Installment
const InstallmentSchema = mongoose.Schema({
    installmentNo: {
        type: Number
    },
    salesNumber:  {
        type: Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    amount: {
        type: Number
    },
    date: {
        type: Date,
    },
    isPaid: {type: Boolean, required: true, default: false},
    breederId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },//belongs to which breeder
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice'
    }
}, { timestamps: true })

InstallmentSchema.plugin(idvalidator);
const Installment = mongoose.model('Installment', InstallmentSchema);

module.exports = { Installment }


