const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
const SaleAnimalSchema = new Schema({ animalId: { type: Schema.Types.ObjectId, ref: 'Animal' , required: true}, price: {type: Number, required: true}, quantity: {type: Number, required: true} });
const SaleProductSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' , required: true}, price: {type: Number, required: true}, quantity: {type: Number, required: true} });
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
    breederId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 

    saleUniqueId: { type: String },
    sellerRole: {
        type: String,
        required: true,
    },
    animals: [SaleAnimalSchema],
    products: [SaleProductSchema],
    // {type: Schema.Types.ObjectId,
    //     ref: 'Animal'}, // can sell to the multiple animal...
   
    tax: {type: Number},
    discount: {type: Number},
    priceWithoutDiscount: {type: Number},
    price: {type: Number},
    totalPrice: { type: Number },
    isPaid: {type: Boolean},
    isInstallment: {type: Boolean, required: false },
    downpayment: {type: Number},
    // installmentId: { type: Number },//..
}, { timestamps: true })

SalesSchema.plugin(idvalidator);
const Sale = mongoose.model('Sale', SalesSchema);

module.exports = { Sale }