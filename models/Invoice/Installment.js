const mongoose = require('mongoose');

const InstallmentSchema = mongoose.Schema({
    // invoiceId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Invoice',required:true
    // },

    // removed contact id i.e contactId...

    salesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',required:true
    },   
    amount:{type:Number,required:true},
    // startDate: {type: Date, required: true},
    // endDate: {type: Date, required: true},
    date: {type: Date, required: true},

    isPaid: {type: Boolean, required: true, default: false},
    
    reminded:{type:Boolean, default:false}

}, { timestamps: true })


const Installment = mongoose.model('Installment', InstallmentSchema);

module.exports = { Installment }