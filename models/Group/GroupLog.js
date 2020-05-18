const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//new GroupLog name
const GroupLogSchema = mongoose.Schema({   
    date:{type:Date},
    employeeId: {type: Schema.Types.ObjectId,
        ref: 'User'},//emp Id
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    groupId: {type: Schema.Types.ObjectId,
        ref: 'Group'}
}, { timestamps: true })

GroupLogSchema.plugin(idvalidator);
const GroupLog = mongoose.model('GroupLog', GroupLogSchema);

module.exports = { GroupLog }