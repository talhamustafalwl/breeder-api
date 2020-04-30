const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const farmSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    address: [
        {
            city: String, state: String, zipcode: Number, country: String
        }
    ],
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'} //belongs to which breeder
}, { timestamps: true })

farmSchema.plugin(idvalidator);
const Farm = mongoose.model('Farm', farmSchema);

module.exports = { Farm }