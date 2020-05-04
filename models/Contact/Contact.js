const mongoose = require('mongoose');

//for Contact create to hold info
const ContactSchema = mongoose.Schema({
    
    firstName:{type:String},
    lastName:{type:String},
    businessName:{type:String},
    plasticTagLoc:{type:String},
    metalTagLoc:{type:String},
    description:{type:String},
    //more...
}, { timestamps: true })


const Contact = mongoose.model('Contact', ContactSchema);

module.exports = { Contact }