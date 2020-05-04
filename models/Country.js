const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const country = mongoose.Schema({
    name: {
        type: String,required:true
    },

})

country.plugin(idvalidator);
const Country = mongoose.model('Country', country);

module.exports = { Country }