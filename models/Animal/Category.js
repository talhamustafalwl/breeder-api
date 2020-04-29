const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//first thing to define animal categories
const categorySchema = mongoose.Schema({
    userId: {type: Schema.Types.ObjectId,ref: 'User'},
    name: {
        type: String,
    },
    active: {
        type: Boolean,default:0
    },
}, { timestamps: true })


const Category = mongoose.model('Category', categorySchema);

module.exports = { Category }