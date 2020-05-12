const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const InvoiceItemSchema = mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',required:true
    },
    animalId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'},
    price:{type:Number,required:true},
    breederId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',required:true
    },//kis ne banae ha invoice
    
}, { timestamps: true })

InvoiceItemSchema.plugin(idvalidator);
const InvoiceItem = mongoose.model('InvoiceItem', InvoiceItemSchema);

module.exports = { InvoiceItem }