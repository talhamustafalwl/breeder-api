const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const cleaningSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    rotationName: {
        type: String,enum:['daily','monthly','weekly','yearly']
    },
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},//who created this
    
},{timestamps: true})


cleaningSchema.plugin(idvalidator);
const Cleaning = mongoose.model('Cleaning', cleaningSchema);

module.exports = { Cleaning }