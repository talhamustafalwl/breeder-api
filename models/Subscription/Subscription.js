const mongoose = require('mongoose');

//define subscription by admin
const SubscriptionSchema = mongoose.Schema({
    name: {type: String},
    type: {type: Number},
    allowedAnimal: {type: Number,required:true},//quantity of allowed animals
    allowedEmp: {type: Number,required:true},//quantity of allowed employees
    isActive: {type: Boolean,default:true},//false hide this
    period: {type: Number,required:true},//number of days
    currency:{type:String,required:true},
    price:{type:Number,required:true}

}, { timestamps: true })


const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = { Subscription }