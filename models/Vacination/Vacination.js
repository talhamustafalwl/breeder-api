const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//name of vacination
const vacinationSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    quantity:{type:Number},
    rotation: {
        type: String,enum:['daily','monthly','weekly','yearly']
    },

    unitId: {type: Schema.Types.ObjectId,
        ref: 'Unit'} 
}, { timestamps: true })

vacinationSchema.plugin(idvalidator);
const Vacination = mongoose.model('Vacination', vacinationSchema);

module.exports = { Vacination }