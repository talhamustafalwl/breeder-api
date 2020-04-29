const mongoose = require('mongoose');

//for providing notes on animal by user
const noteSchema = mongoose.Schema({
    note: {
        type: String,required:true
    },
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'} ,
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    empId: {type: Schema.Types.ObjectId,
        ref: 'Employee'} 
}, { timestamps: true })


const Note = mongoose.model('Note', noteSchema);

module.exports = { Note }