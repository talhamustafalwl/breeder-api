const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//subscriber details
const SubscriberSchema = mongoose.Schema({
    breederId: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    subscriptionId: {
        type:Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    
    email:String,
    description:{type:String,required: true },
    customer:String,
    price:{type:Number,required: true },
    currency:String,
    created:Number,
    payment_method_detail:String,
    brand:String,
    country:String,
},{timestamps: true})


SubscriberSchema.plugin(idvalidator);
const Subscriber= mongoose.model('Subscriber', SubscriberSchema);

module.exports = { Subscriber }