const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

const feedHistorySchema = mongoose.Schema({
    animalFeedId: {type: Schema.Types.ObjectId,
        ref: 'AnimalFeed'},
    quantity: {
        type: Number,required:true
    },
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    employeeId: {type: Schema.Types.ObjectId,
        ref: 'User'}


}, { timestamps: true })

feedHistorySchema.plugin(idvalidator);
const FeedHistory = mongoose.model('FeedHistory', feedHistorySchema);

module.exports = { FeedHistory }