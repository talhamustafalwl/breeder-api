const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

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


HealthSchema.plugin(idvalidator);
const Health = mongoose.model('Health', HealthSchema);

module.exports = { Health }