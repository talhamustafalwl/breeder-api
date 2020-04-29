const mongoose = require('mongoose');
//Feed name with unit(e.g: kg,grams)
const feedSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    unitId:  {type: Schema.Types.ObjectId,
        ref: 'Unit'},
    
}, { timestamps: true })


const Feed = mongoose.model('Feed', feedSchema);

module.exports = { Feed }