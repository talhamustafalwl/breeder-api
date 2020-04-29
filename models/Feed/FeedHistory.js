const mongoose = require('mongoose');

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


const FeedHistory = mongoose.model('FeedHistory', feedHistorySchema);

module.exports = { FeedHistory }