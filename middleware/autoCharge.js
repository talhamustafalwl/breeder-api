const { Subscriber } = require('../models/Subscription/Subscriber');
const { Subscription } = require("../models/Subscription/Subscription");
const moment=require('moment')
const payment = require("../misc/payment");

let autoCharge =function (req, res, next) {
    if(!req.user || req.user.role == "employee" ){
      return next()
    }
    let breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
    console.log(breederId,"<---breederId")
   
    return new Promise(async (resolve, reject) => {
    await Subscriber.findOne({userId:breederId}).then(
     async (result) => {
        try{
          // console.log(result,"<<resultresult")
          if(result && result.toDate <= moment().toDate()){
            const subscription = await Subscription.findById(result.subscriptionId);
            console.log(subscription,"<<subscription")
            
            const subscriptionAmount = result.type === "lifetime" ?  subscription.lifetimePrice :
            result.type === "yearly" ?  subscription.yearlyPrice :subscription.monthlyPrice

            // const subscriptionAmount = subscription.monthlyPrice ? subscription.monthlyPrice : subscription.lifetimePrice; 
            // console.log(req.user.creditCard[0]._id,req.user.creditCard[0].customer,"<<subscription")
            let charged;
            if(req.user.creditCard && req.user.creditCard[0])
            {
            charged=await payment.charge(subscriptionAmount, req.user.creditCard[0].card.id,req.user.creditCard[0].customer, 'Charge for subscription' );
            }
            if(charged || (req.user.creditCard && req.user.creditCard.length < 1)){
              console.log("inside")
              result.fromDate = new Date();
              result.toDate = result.type === "lifetime" ? (new Date(new Date().setFullYear(new Date().getFullYear()+100)))
              : result.type === "yearly" ? (new Date(new Date().setFullYear(new Date().getFullYear()+1))) :   
               (new Date(new Date().setMonth(new Date().getMonth()+1)))
              
              await Subscriber.findOneAndUpdate(
                { userId:breederId},
                result,
                { new: true }
              ); 
              resolve()
              return next()
            }
          }
          else{
            resolve()
            return next()
          }
        }
        
    catch(err){
      resolve()
      return next()
      console.log(err,"<---err")
    }
  })
});
  return next()
   
}

module.exports = { autoCharge };