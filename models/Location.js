const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for providing Locations on animal by user
const LocationSchema = mongoose.Schema({
    city: {
        type: String,required:true
    },
    state: {
        type: String,required:true
    },
    country: {
        type: String,default:"Usa"
    },
    zipcode: {
        type: Number,required:true
    },
    street: {type: String,required:true},
    area: {type: String},
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    code: {type: String,required:true},//postal code
}, { timestamps: true })


LocationSchema.plugin(idvalidator);
const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location }