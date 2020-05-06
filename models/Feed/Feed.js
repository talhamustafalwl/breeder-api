const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//Feed name with unit(e.g: kg,grams)
const feedSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    unitName: {
        type: String,required:true
    },
    units: {
        type: Number
    },//weight or number
    //unitId:  {type: Schema.Types.ObjectId,
    //    ref: 'Unit'},
        
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'} //kn se user ne add kia ha
    
}, { timestamps: true })

feedSchema.plugin(idvalidator);
const Feed = mongoose.model('Feed', feedSchema);

module.exports = { Feed }