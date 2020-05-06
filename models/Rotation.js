const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for providing Rotations
const RotationSchema = mongoose.Schema({
    name: {
        type: String,required:true,unique:true
    },
 
}, { timestamps: true })


RotationSchema.plugin(idvalidator);
const Rotation = mongoose.model('Rotation', RotationSchema);

module.exports = { Rotation }