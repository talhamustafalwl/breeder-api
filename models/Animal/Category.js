const mongoose = require('mongoose');
//first thing to define animal categories
//?? it is created by admin
const categorySchema = mongoose.Schema({
    //userId: {type: Schema.Types.ObjectId,ref: 'User'},
    name: {
        type: String, unique: true
    },
    active: {
        type: Boolean, default: 0
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    }
}, { timestamps: true })


//downcase name
categorySchema.pre('save', function (next) {
    var category = this;
    category.name = this.name.toLowerCase();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category }