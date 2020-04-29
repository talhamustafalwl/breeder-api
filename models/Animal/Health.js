const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//health certificate
const HealthSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    detail: {
        type: String,
    },
    date: {
        type: Date
    },
    animaltId: [{type: Schema.Types.ObjectId,
        ref: 'Animal'}]
}, { timestamps: true })


const Health = mongoose.model('Health', HealthSchema);

module.exports = { Health }