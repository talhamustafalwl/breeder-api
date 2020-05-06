const mongoose = require('mongoose');
//element will created by admin
const ElementSchema = mongoose.Schema({
    name: { type: String },
    type: { type: String },
    validation: {
        minLength: { type: Boolean },
        maxLength: { type: Boolean },
        allowNumber: { type: Boolean },
        decimalPlacesLength: { type: Boolean },
        allowString: { type: Boolean },
        allowSpecialCharacter: { type: Boolean },
        allowSpace: { type: Boolean },
        shouldAtLeastOneUpperCase: { type: Boolean },
        shouldAtLeastOneSpecialCharacter: { type: Boolean },
        shouldAtLeastOneLowerCase: { type: Boolean },
        shouldAtLeastOneNumber: { type: Boolean },
    }
}, { timestamps: true })


const Element = mongoose.model('Element', ElementSchema);

module.exports = { Element }