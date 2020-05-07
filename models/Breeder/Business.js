const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;
//for Business location and to which breeder its belong
const BusinessSchema = mongoose.Schema({
    breederId: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{type:String,required:true},
    street1:{type:String,required:true},
    street2:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    zipcode:{type:String,required:true},
    mobile:{type:Number},
    logo:{type:String},//logo image here
    email:{type:String,required:true,unique:true},
}, { timestamps: true })


BusinessSchema.plugin(idvalidator);
const Business = mongoose.model('Business', BusinessSchema);

module.exports = { Business }