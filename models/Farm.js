const mongoose = require('mongoose');

//for farm location and to whom breeder this belongs
const farmSchema = mongoose.Schema({
    name: {
        type: String,required:true
    },
    address: [
        {
            city: String, state: String, zipcode: Number, country: String
        }
    ],
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'} //belongs to which breeder
}, { timestamps: true })


const Farm = mongoose.model('Farm', farmSchema);

module.exports = { Farm }