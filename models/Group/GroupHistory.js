const mongoose = require('mongoose');

//new GroupHistory name
const GroupHistorySchema = mongoose.Schema({   
    date:{type:Date},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    groupId: {type: Schema.Types.ObjectId,
        ref: 'Group'}
}, { timestamps: true })


const GroupHistory = mongoose.model('GroupHistory', GroupHistorySchema);

module.exports = { GroupHistory }