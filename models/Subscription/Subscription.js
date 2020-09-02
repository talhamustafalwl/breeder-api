const mongoose = require('mongoose');

//define subscription by admin
const SubscriptionSchema = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    type: {type: String},
    allowedAnimal: {type: Number,required:true},//quantity of allowed animals
    allowedEmp: {type: Number,required:true},//quantity of allowed employees
    isActive: {type: Boolean,default:true},//false hide this
    period: {type: Number,required:true},//number of days
    currency:{type:String,required:true},
    price:{type:Number,required:true},
    defaultPackage:{type:Boolean,default:false},
}, { timestamps: true })


const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = { Subscription }