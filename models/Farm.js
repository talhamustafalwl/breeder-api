const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for farm location and to whom breeder this belongs

const FarmCategories = mongoose.Schema({categoryId:{type: Schema.Types.ObjectId, ref: 'Category',required:true}, categoryName: {type: String, required: true}})

const farmSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },     city: String, state: String, zipcode: Number,
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User',required:true}, //belongs to which breeder
    state: {
        type: String,
        required: true,
    },
    city: {
        type:String,
        required: true,
    },
    zipcode: {
        type:String,
        required: true,
    },
    categories: [FarmCategories],
}, { timestamps: true })


farmSchema.plugin(idvalidator);
const Farm = mongoose.model('Farm', farmSchema);

module.exports = { Farm }