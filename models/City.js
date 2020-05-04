const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const city = mongoose.Schema({
    id: {
        type: String,required:true
    },
    name: {
        type: String,required:true
    },
    //stateId: {type: Schema.Types.ObjectId,
    //    ref: 'State',required:true} //belongs to which country
    stateId: {
        type: String,required:true
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
   
    
})

city.plugin(idvalidator);
const City = mongoose.model('City', city);

module.exports = { City }