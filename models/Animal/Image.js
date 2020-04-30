const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const imgSchema = mongoose.Schema({
    userId: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },//who have uploaded image
    animalId: {
        type: Schema.Types.ObjectId,
        ref: 'Animal'
    },//which animal belongs
    empId: {type: Schema.Types.ObjectId,
        ref: 'Employee'} ,//if employee uploaded
    filepath:{type:String,required: true },
    imagetype:{type:String,required: true },
    
}, { timestamps: true })

imgSchema.plugin(idvalidator);
const Image= mongoose.model('Image', imgSchema);

module.exports = { Image }