const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const CurrencySchema = mongoose.Schema({
    name: {
        type: String, required: true
    },
    shortName: { type: String, required: true },
    symbol: { type: String, required: true },
    rate: { type: Number },

})

CurrencySchema.plugin(idvalidator);

CurrencySchema.pre('save', function (next) {
    currency.find({ name: this.name }).then(result => {
        console.log(result);
        if (result.length > 0) return next(new Error('Currency Already Exist'));
        return next();
    })
});

const currency = mongoose.model('Currency', CurrencySchema);

module.exports = { currency }