const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const state = mongoose.Schema({
    name: {
        type: String,required:true
    },
    countryId: {type: Schema.Types.ObjectId,
        ref: 'Country',required:true}, //belongs to which country
    countryName: {
        type: String,required:true
    },
    prefix: {
        type: String,required:true
    },
    id: {
        type: String,required:true
    },
})

state.plugin(idvalidator);
const State = mongoose.model('State', state);

module.exports = { State }