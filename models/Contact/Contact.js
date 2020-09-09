const mongoose = require('mongoose');

//for Contact create to hold info
const ContactSchema = mongoose.Schema({
    
    name:{type:String},
    businessName:{type:String},
    address: {type: String},
    email: {type: Array},
    phone: {type: Array},
    category: {type: String},
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
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

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = { Contact }