const mongoose = require('mongoose');

//for farm location and to whom breeder this belongs
const zipcode = mongoose.Schema({
    City: {
        type: String,required:true
    },
    zipcode: {
        type: String,required:true
    }
    
})

const Zipcode = mongoose.model('Zipcode', zipcode);

module.exports = { Zipcode }