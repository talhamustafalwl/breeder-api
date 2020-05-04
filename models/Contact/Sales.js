const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
//for Sales create to hold info
const SalesSchema = mongoose.Schema({
    contactId: {type: Schema.Types.ObjectId,
        ref: 'Contact'}, //belongs to which contact
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'}, //belongs to which user
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    price:{type:Number},
    installmentId:{type:Number},//..
}, { timestamps: true })

SalesSchema.plugin(idvalidator);
const Sale = mongoose.model('Sale', SalesSchema);

module.exports = { Sale }