const mongoose = require('mongoose');

const unitSchema = mongoose.Schema({
    name: {
        type: String,required:true,unique:true
    },
    
})

unitSchema.pre('save', function (next) {
    var unit = this;
    unit.name = this.name.toLowerCase()
    next()
})

const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Unit }