const mongoose = require('mongoose');
//employee designation name
const DesignationSchema = mongoose.Schema({
    name: {
        type: String
    },
})


const Designation = mongoose.model('Designation', DesignationSchema);

module.exports = { Designation }