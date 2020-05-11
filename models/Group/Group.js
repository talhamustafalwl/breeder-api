const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');
//new group name
const GroupSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    locationId: {type: Schema.Types.ObjectId,
        ref: 'Location'},
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'},//created by..
}, { timestamps: true })

GroupSchema.plugin(idvalidator);
const Group = mongoose.model('Group', GroupSchema);

module.exports = { Group }