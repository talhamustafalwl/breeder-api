const mongoose = require('mongoose');

//define subscription by admin
const SubscriptionSchema = mongoose.Schema({
    name: {type: String},
    type: {type: Number},
    allowedAnimal: {type: Number},//quantity of allowed animals
    allowedEmp: {type: Number},//quantity of allowed employees
    active: {type: Boolean},//0 for not active,1 for active
    period: {type: Number},//number of days
    price:{type:Number}

}, { timestamps: true })


const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = { Subscription }