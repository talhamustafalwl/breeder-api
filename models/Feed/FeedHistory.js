const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const feedHistorySchema = mongoose.Schema({
    feedanimalId: {type: Schema.Types.ObjectId,
        ref: 'FeedAnimal',required:true},
    quantity: {
        type: Number,required:true
    },
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal',required:true},
    empId: {type: Schema.Types.ObjectId,
        ref: 'User',required:true},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'}, //kn se breeder ya emp ne add kia ha
    date:Date
    
}, { timestamps: true })

feedHistorySchema.plugin(idvalidator);
const FeedHistory = mongoose.model('FeedHistory', feedHistorySchema);

module.exports = { FeedHistory }