const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

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

GroupHistorySchema.plugin(idvalidator);
const GroupHistory = mongoose.model('GroupHistory', GroupHistorySchema);

module.exports = { GroupHistory }