const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//name of vacination
const vacinationSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    unitName:{type:String},
    quantity:{type:Number},
    rotationName: {
        type: String,enum:['daily','monthly','weekly','yearly']
    },
    uniName:{type:String},
    //unitId: {type: Schema.Types.ObjectId,
    //    ref: 'Unit'}
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'} 
}, { timestamps: true })

vacinationSchema.plugin(idvalidator);
const Vacination = mongoose.model('Vacination', vacinationSchema);

module.exports = { Vacination }