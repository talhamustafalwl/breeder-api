const mongoose = require('mongoose');

//for Contact create to hold info
const ContactSchema = mongoose.Schema({
    
    name:{type:String},
    businessName:{type:String},
    address: {type: String},
    email: {type: Array},
    phone: {type: Array},
    state: {type: String},
    city: {type: String},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    isActive:{ type : Boolean, default: true},
    isRemoved:{ type : Boolean, default: false},

    address:{type:String},
    description:{type:String},
    breederId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    //more...
}, { timestamps: true })



ContactSchema.pre('save', function (next) {
    var contact = this;
    contact.name = this.name.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(' ').trim()
    next()

});
ContactSchema.pre('findOneAndUpdate', function(next) {
    var contact = this._update.$set;
    contact.name = contact.name.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(' ').trim()
    next()
});


ContactSchema.index({ "category": 1, "email": 1,"isRemoved":1}, { "unique": true });
const Contact = mongoose.model('Contact', ContactSchema);

module.exports = { Contact }