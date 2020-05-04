const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const imgSchema = mongoose.Schema({
    userId: {
        type:Schema.Types.ObjectId,
        ref: 'User',required:true
    },//who have uploaded image
    animalId: {
        type: Schema.Types.ObjectId,
        ref: 'Animal',required:true
    },//which animal belongs
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User',required:true} ,//owner of animal Id
    filepath:{type:String,required:true},
    imagetype:{type:String},
    empAdded:{type:Boolean,default:false},
    name: {
        type: String,
        maxlength: 50,
    },
}, { timestamps: true })

imgSchema.plugin(idvalidator);
const Image= mongoose.model('Image', imgSchema);

module.exports = { Image }