const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//FormElement will be taken by breeder
const FormElementSchema = mongoose.Schema({    
    name:{type:String},
    elementId: [{type: Schema.Types.ObjectId,
        ref: 'Element'}],//multiple elements
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'},//breeder
    categoryId: {type: Schema.Types.ObjectId,
        ref: 'Category'},//animal category
    caption:{type:String}
    
}, { timestamps: true })

FormElementSchema.plugin(idvalidator);
const FormElement = mongoose.model('FormElement', FormElementSchema);

module.exports = { FormElement }