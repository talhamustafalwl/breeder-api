const mongoose = require('mongoose');

const cleaningHistorySchema = mongoose.Schema({
    date:{type:Date},
    employeeId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    cleaningId: {type: Schema.Types.ObjectId,
        ref: 'Cleaning'},
        
    
},{timestamps: true})


const CleaningHistory = mongoose.model('CleaningHistory', cleaningHistorySchema);

module.exports = { CleaningHistory }