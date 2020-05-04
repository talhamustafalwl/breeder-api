const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
    contactId: {type: Number},
    type: {type: Number},
    date: {type: Date},
    
}, { timestamps: true })


const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice }