const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const FeedAnimalSchema = mongoose.Schema({
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    feedId: {type: Schema.Types.ObjectId,
        ref: 'Feed'},
    quantity:{type:Number,required:true},
    date:{type:Date},
    description:{type:String,required:true},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'}, //kn se breeder ya emp ne add kia ha
    rotation:String,  
    
}, { timestamps: true })

FeedAnimalSchema.plugin(idvalidator);
const FeedAnimal = mongoose.model('FeedAnimal', FeedAnimalSchema);

module.exports = { FeedAnimal }