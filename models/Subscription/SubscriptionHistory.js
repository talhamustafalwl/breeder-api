const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//subscriber details
const SubscriptionHistrySchema = mongoose.Schema({
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
    type: {type: String, enum: ['monthly', 'yearly']},
    isActive: {type: Boolean, default: true},
    isExpired: {type: Boolean, default: false},
    expiredOn: {type: Date},
    payment: {type: Object}

    // transactionId: {
    //     type:Schema.Types.ObjectId,
    //     ref: 'Transaction'
    // },
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


SubscriptionHistrySchema.plugin(idvalidator);
const SubscriptionHistory= mongoose.model('SubscriptionHistory', SubscriptionHistrySchema);

module.exports = { SubscriptionHistory }