const mongoose = require('mongoose');

//for Activity create to hold info
const ActivitySchema = mongoose.Schema({
    
    name:{type:String},
    categoryName:{type:String},
    categoryId:{type: mongoose.Schema.Types.ObjectId,ref: 'Category',require: true},
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,ref: 'User',require: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    animalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    },
    description:{type:String},
    breederId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    date:{type:Date},
    //more...
}, { timestamps: true })


const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = { Activity }