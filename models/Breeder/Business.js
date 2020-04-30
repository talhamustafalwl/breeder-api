const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;
//for Business location and to which breeder its belong
const BusinessSchema = mongoose.Schema({
    breederId: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{type:String},
    registrationNumber:{type:Number},
    otherDocument:{type:String},//image here
    description:{type:String},
}, { timestamps: true })

BusinessSchema.plugin(idvalidator);
const Business = mongoose.model('Business', BusinessSchema);

module.exports = { Business }