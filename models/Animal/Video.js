const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },//who have uploaded image
    animalId: {
        type: Schema.Types.ObjectId,
        ref: 'Animal'
    },//which animal belongs
    empId: {type: Schema.Types.ObjectId,
        ref: 'Employee'} ,//if employee uploaded
    name: {
        type: String,
        maxlength: 50,
    },
    filePath: {
        type: String,
    },
    duration: {
        type: String
    }
}, { timestamps: true })


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }