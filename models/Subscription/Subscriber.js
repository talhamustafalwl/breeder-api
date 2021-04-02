const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//subscriber details
const SubscriberSchema = mongoose.Schema({
    userId: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    subscriptionId: {
        type:Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    userType: {
        type: String,
        enum: ['breeder', 'employee']
    },
    fromDate:{type:Date},
    toDate:{type:Date},
    type: {type: String, enum: ['monthly', 'yearly','lifetime']},
    payment: {type: Object},
    productId:{type: String},
    transactionId:{type: String},
    transactionDate:{type: Date},
    // payment_gateway:{type:String},
    // email:String,
    // description:{type:String },
    // customer:String,
    // created:Number,
    // payment_method_detail:String,
    // brand:String,
    // country:String,
    //for save populate
    // price:{type:Number },
    // currency:{type:String},
    // allowedAnimal:{type:Number},
    // allowedEmp:{type:Number},
    // name:{type:String}
    ///
},{timestamps: true})


SubscriberSchema.plugin(idvalidator);
const Subscriber= mongoose.model('Subscriber', SubscriberSchema);

module.exports = { Subscriber }