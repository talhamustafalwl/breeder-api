const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const videoSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',required:true
    },//who have uploaded image
    animalId: {
        type: Schema.Types.ObjectId,
        ref: 'Animal',required:true
    },//which animal belongs
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User',required:true} ,//owner of animal Id
    name: {
        type: String,
        maxlength: 50,
    },
    filepath: {
        type: String,required:true
    },
    duration: {
        type: String
    },
    empAddedimage:{type:Boolean,default:false}
}, { timestamps: true })

videoSchema.plugin(idvalidator);
const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }