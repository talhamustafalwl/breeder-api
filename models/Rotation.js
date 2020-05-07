const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for providing Rotations
const RotationSchema = mongoose.Schema({
    name: {
        type: String,required:true,unique:true
    },
 
}, { timestamps: true })

RotationSchema.pre('save', function (next) {
    var rotation = this;
    rotation.name = this.rotation.toLowerCase()
    next()
})

RotationSchema.plugin(idvalidator);
const Rotation = mongoose.model('Rotation', RotationSchema);

module.exports = { Rotation }