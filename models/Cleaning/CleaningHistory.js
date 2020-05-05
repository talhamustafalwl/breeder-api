const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const cleaningHistorySchema = mongoose.Schema({
    date:{type:Date},
    empId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    cleaningId: {type: Schema.Types.ObjectId,
        ref: 'Cleaning'},
        
    
},{timestamps: true})

cleaningHistorySchema.plugin(idvalidator);
const CleaningHistory = mongoose.model('CleaningHistory', cleaningHistorySchema);

module.exports = { CleaningHistory }