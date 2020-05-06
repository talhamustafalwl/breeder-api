const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//kis animal ko kn se vacination dene ha
const animalvacinationSchema = mongoose.Schema({
    
    date:{type:Date},
    description:{type:String},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    vacinationId: {type: Schema.Types.ObjectId,
        ref: 'Vacination'},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    empId: {type: Schema.Types.ObjectId,
        ref: 'User'},   
}, { timestamps: true })

animalvacinationSchema.plugin(idvalidator);
const VacinationAnimal = mongoose.model('VacinationAnimal', animalvacinationSchema);

module.exports = { VacinationAnimal }