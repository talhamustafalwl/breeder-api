const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
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
    },
    type: {
        type: String, enum: ["animal", "activity", "product", "contact"]
    },
    icon: {
        type: String,
    },
    subType: [{type: String}],
    breeds: [{name: {type: String}}],
}, { timestamps: true })


//downcase name
categorySchema.pre('save', function (next) {
    var category = this;
    // category.name = this.name.toLowerCase();
    next();
});

categorySchema.plugin(idvalidator);
const Category = mongoose.model('Category', categorySchema);

module.exports = { Category }