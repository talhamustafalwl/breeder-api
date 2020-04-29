const mongoose = require('mongoose');

//for Employee 
const EmployeeSchema = mongoose.Schema({
    appointmentDate: {
        type: Date
    },
    dataOfBirth: {
        type: Date
    },
    mobile: {
        type: Number,minglength: 9,maxlength:10
    },
    email: {
        type:String,trim:true,unique: 1 
    },
    gender: {
        type: String,enum: ["male", "female"]
    },
    address: [
        {
            city: String, state: String, zipcode: Number, country: String,street:String
        }
    ],
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'} ,//belongs to which breeder
    farmId: {type: Schema.Types.ObjectId,
        ref: 'Farm'}, //belongs to which farm
    designationId: {type: Schema.Types.ObjectId,
        ref: 'Designation'}, 
}, { timestamps: true })


const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = { Employee }