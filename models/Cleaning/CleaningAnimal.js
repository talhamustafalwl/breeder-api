const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const cleaningHistorySchema = mongoose.Schema({
    date:{type:Date},
    empId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},//who created this
    
    //cleaningId: {type: Schema.Types.ObjectId,
    //    ref: 'Cleaning'},
    cleaningName:{type:String, required:true},
    rotationName:{type:String, required:true},
},{timestamps: true})

cleaningHistorySchema.plugin(idvalidator);
const CleaningAnimal = mongoose.model('CleaningAnimal', cleaningHistorySchema);

module.exports = { CleaningAnimal }