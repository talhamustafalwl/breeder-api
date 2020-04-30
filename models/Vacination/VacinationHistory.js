const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//VacinationHistory kb de kis ko
const VacinationHistorySchema = mongoose.Schema({
    
    date:{type:Date},
    description:{type:String},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    vacinationId: {type: Schema.Types.ObjectId,
        ref: 'Vacination'},
    employeeId: {type: Schema.Types.ObjectId,
        ref: 'User'}
}, { timestamps: true })

VacinationHistorySchema.plugin(idvalidator);
const VacinationHistory = mongoose.model('VacinationHistory', VacinationHistorySchema);

module.exports = { VacinationHistory }