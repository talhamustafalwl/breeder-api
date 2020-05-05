const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const cleaningHistorySchema = mongoose.Schema({
    date:{type:Date},
    employeeId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    cleaningId: {type: Schema.Types.ObjectId,
        ref: 'Cleaning'},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},//who created this
    
},{timestamps: true})

cleaningHistorySchema.plugin(idvalidator);
const CleaningHistory = mongoose.model('CleaningHistory', cleaningHistorySchema);

module.exports = { CleaningHistory }