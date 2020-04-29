const mongoose = require('mongoose');
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


const FormElement = mongoose.model('FormElement', FormElementSchema);

module.exports = { FormElement }