const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//employee designation name
const DesignationSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    breederId: {type: Schema.Types.ObjectId,ref: 'User',
    required:true} ,//which breeder has added this
})


const Designation = mongoose.model('Designation', DesignationSchema);

module.exports = { Designation }