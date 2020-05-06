const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs
const farmSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },

     city: String, state: String, zipcode: Number,

    breederId: {type: Schema.Types.ObjectId,
        ref: 'User',required:true}, //belongs to which breeder
    categoryId: {type: Schema.Types.ObjectId,
        ref: 'Category',required:true} //belongs to which category
        ,
    categoryName: {type: String}
}, { timestamps: true })

farmSchema.plugin(idvalidator);
const Farm = mongoose.model('Farm', farmSchema);

module.exports = { Farm }