const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const zipcode = mongoose.Schema({

    //cityId: {type: Schema.Types.ObjectId,
    //    ref: 'City',required:true} //belongs to which country
    cityId: {
        type: String,required:true
    },
    zip: {
        type: String,required:true
    }
    
})

zipcode.plugin(idvalidator);
const Zipcode = mongoose.model('Zipcode', zipcode);

module.exports = { Zipcode }