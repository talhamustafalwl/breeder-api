const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
const SaleAnimalSchema = new Schema({ animalId: { type: Schema.Types.ObjectId, ref: 'Animal' , required: true}, price: {type: Number, required: true}, quantity: {type: Number, required: true} });
//for Sales create to hold info
const SalesSchema = mongoose.Schema({
    // contactId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Contact',
    //     required: true
    // }, //belongs to which contact

    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, //belongs to which user
    sellerRole: {
        type: String,
        required: true,
    },
    animals: [SaleAnimalSchema],
    // {type: Schema.Types.ObjectId,
    //     ref: 'Animal'}, // can sell to the multiple animal...
    totalPrice: { type: Number },
    tax: {type: Number},
    price: {type: Number},
    isPaid: {type: Boolean},
    isInstallment: {type: Boolean, required: false },
    downpayment: {type: Number},
    // installmentId: { type: Number },//..
}, { timestamps: true })

SalesSchema.plugin(idvalidator);
const Sale = mongoose.model('Sale', SalesSchema);

module.exports = { Sale }