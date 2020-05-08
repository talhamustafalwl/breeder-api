const mongoose = require('mongoose');

const InstallmentSchema = mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',required:true
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',required:true
    },
   
    installmentNo:{type:Number,required:true},
    amount:{type:Number,required:true},
    reminded:{type:Boolean,default:false}

}, { timestamps: true })


const Installment = mongoose.model('Installment', InstallmentSchema);

module.exports = { Installment }