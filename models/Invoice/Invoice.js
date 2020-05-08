const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const InvoiceSchema = mongoose.Schema({
    contactId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'},
    type: {type: String},
    date: {type: Date,required:true,default:Date.now()},
    breederId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',required:true
    },//kis ne banae ha invoice
    
}, { timestamps: true })

InvoiceSchema.plugin(idvalidator);
const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice }