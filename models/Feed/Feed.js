const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//Feed name with unit(e.g: kg,grams)
const feedSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    unitId:  {type: Schema.Types.ObjectId,
        ref: 'Unit'},
    
}, { timestamps: true })

feedSchema.plugin(idvalidator);
const Feed = mongoose.model('Feed', feedSchema);

module.exports = { Feed }