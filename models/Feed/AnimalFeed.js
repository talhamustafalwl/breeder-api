const mongoose = require('mongoose');

const animalFeedSchema = mongoose.Schema({
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    feedId: {type: Schema.Types.ObjectId,
        ref: 'Feed'},
    quantity:{type:Number,required:true},
    description:{type:Number,required:true}
    
}, { timestamps: true })


const AnimalFeed = mongoose.model('AnimalFeed', animalFeedSchema);

module.exports = { AnimalFeed }