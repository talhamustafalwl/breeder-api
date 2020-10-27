const mongoose = require('mongoose');

//define subscription by admin
const SubscriptionSchema = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    type: {type: String},
    allowedAnimal: {type: Number,required:true},//quantity of allowed animals
    allowedEmp: {type: Number,required:true},//quantity of allowed employees
    allowedProduct: {type: Number,required:true},//quantity of allowed products
    isActive: {type: Boolean,default:true},//false hide this
    currency:{type:String,required:true},
    monthlyPrice:{type:Number,required:true},
    yearlyPrice:{type:Number,required:true},
    icon: {type: String},
    defaultPackage:{type:Boolean,default:false},
}, { timestamps: true })


const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = { Subscription }