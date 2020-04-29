const mongoose = require('mongoose');

//new group name
const GroupSchema = mongoose.Schema({
    name: {
        type: String,required:true
    }
}, { timestamps: true })


const Group = mongoose.model('Group', GroupSchema);

module.exports = { Group }