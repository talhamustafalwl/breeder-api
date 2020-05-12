const mongoose = require('mongoose');

const StatusSchema = mongoose.Schema({
    name: {
        type: String,required:true,unique:true
    },
    
})


const Status = mongoose.model('Status', StatusSchema);

module.exports = { Status }