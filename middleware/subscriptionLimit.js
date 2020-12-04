const { Animal } = require('../models/Animal/Animal');
const { Product } = require('../models/Product');
const { User } = require('../models/User');

const { Subscriber } = require('../models/Subscription/Subscriber');

let checkSubscriptionLimit = function (req, res, next) {
    console.log(req.type);
    breederId=req.user.role == "employee" ? req.user.breederId : req.user._id

    Subscriber.findOne({userId: breederId}).populate('subscriptionId').then(resultSubscription => {
        if(req.type === 'animal') {
            Animal.find({breederId: req.user._id}).then(responseAnimal => {
                console.log(responseAnimal.length);
                console.log(resultSubscription);
                if(responseAnimal.length < resultSubscription.subscriptionId.allowedAnimal) {
                    return next();
                } else {
                    return res.json({status:405,message:"No more animals allowed (subscription limit reached)",data:{}});
                }
            })
        } else if (req.type === 'product') {
            Product.find({breederId: req.user._id}).then(responseProduct => {
                if(responseProduct.length < resultSubscription.subscriptionId.allowedProduct) {
                    return next();
                } else {
                    return res.json({status:405,message:"No more product allowed (subscription limit reached)",data:{}});
                }
            });
        } else if (req.type === 'employee') {
            User.find({role: 'employee', breederId: req.user._id, isEmployeeActive: true}).then(responseEmployee => {
                if(responseEmployee.length < resultSubscription.subscriptionId.allowedEmp) {
                    return next();
                } else {
                    return res.json({status:405,message:"No more employee allowed (subscription limit reached)",data:{}});
                }
            });
        }
    }).catch(error => {
        return res.json({status:400,message:"Error While checking subscription",data:{} });
    });
}

module.exports = { checkSubscriptionLimit };