const mongoose = require('mongoose');
//element will created by admin
const ElementSchema = mongoose.Schema({    
    name:{type:String},
    typeOf:{type:Number},
    value:{type:String},//for placeholder
}, { timestamps: true })


const Element = mongoose.model('Element', ElementSchema);

module.exports = { Element }