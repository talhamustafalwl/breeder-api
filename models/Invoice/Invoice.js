const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const AnimalArraySchema = mongoose.Schema({ animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' , required: true}, price: {type: Number, required: true} });
const InvoiceSchema = mongoose.Schema({
    contactId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'},
    type: {type: String}, // sale etc
    // remove breederid
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',required:true
    },//kis ne banae ha invoice
    items: [AnimalArraySchema], 
    
}, { timestamps: true })

InvoiceSchema.plugin(idvalidator);
const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice }