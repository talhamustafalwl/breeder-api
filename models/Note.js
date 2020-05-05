const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//for providing notes on animal by user
const noteSchema = mongoose.Schema({
    note: {
        type: String,required:true
    },
    animalId: [{type: Schema.Types.ObjectId,
        ref: 'Animal'}],//multiple animal
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    empId: {type: Schema.Types.ObjectId,
        ref: 'Employee'},
    date:Date 
}, { timestamps: true })


noteSchema.plugin(idvalidator);
const Note = mongoose.model('Note', noteSchema);

module.exports = { Note }