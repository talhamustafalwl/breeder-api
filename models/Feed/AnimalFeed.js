const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const animalFeedSchema = mongoose.Schema({
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    feedId: {type: Schema.Types.ObjectId,
        ref: 'Feed'},
    quantity:{type:Number,required:true},
    description:{type:Number,required:true}
    
}, { timestamps: true })

animalFeedSchema.plugin(idvalidator);
const AnimalFeed = mongoose.model('AnimalFeed', animalFeedSchema);

module.exports = { AnimalFeed }