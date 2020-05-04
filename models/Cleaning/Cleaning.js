const mongoose = require('mongoose');

const cleaningSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    rotation: {
        type: String,enum:['daily','monthly','weekly','yearly']
    },
    
    
},{timestamps: true})


const Cleaning = mongoose.model('Cleaning', cleaningSchema);

module.exports = { Cleaning }