const { User } = require('../models/User');
const { Subscriber } = require('../models/Subscription/Subscriber');
const { Subscription } = require("../models/Subscription/Subscription");
const moment=require('moment')
const payment = require("../misc/payment");

let auth = (req, res, next) => {
  //console.log("auth")
  // console.log('auth called');
  // console.log(req.route);
  // console.log('headers : ', req.headers['auth']) 
  // console.log('cookies :  ', req.cookies['w_auth']);

  let token = req.headers['auth'];
  if(!token){
    token=req.cookies['w_auth'];
  }

  //console.log(token);
  
  if (!token)
    {return res.send({ status: 400, message: 'No token provided header(auth).',data:{} });}

  User.findOne({token}, async (err, user) => {
    //console.log(token);
    //console.log('auth');
    //console.log(user);
    if (err) throw err;
    if (!user)
      return res.status(202).json({
        status:400,isAuth: false,message:"auth token is invalid",data:{}
      });

      // console.log(user)
  
      let breederId;
      breederId=user.role == "employee" ? user.breederId : user._id

      // await handleCharge(user,breederId)


      req.token = token;
        req.user = user;
        req.isAuthenticate = false;
        if(user.isAdmin) return next();
        if(user.role == "employee" && !user.isEmployeeActive)
        return res.status(202).json({
          status:400,message:"Breeder removed your account",data:{}
        })
    
        if(user.role == "employee" && !user.canAccessMobileApp)
        return res.status(202).json({
          status:400,message:"Breeder blocked your account",data:{}
        })
    
        if(user.role == "employee" && !user.active)
        return res.status(202).json({
          status:400,message:"Breeder disabled your account",data:{}
        })
        
    
        if (user.isblocked)
        return res.status(202).json({status: 400,message: "Admin blocked your account",
          data: {}});
          
          
        ///subscribtion date validation (block apis after trial period)
          breederId=user.role == "employee" ? user.breederId : user._id
          
        //     const toDate = await Subscriber.findOne({breederId}).then(
        //       result=> !result ? result: result.toDate
        //   );
        //   if(!toDate) return res.json({
        //     status:400,message:"Not Subscribd Yet!",data:{}
        //   });
        //   diff=toDate.getTime() - new Date(Date.now()).getTime()
        //   //console.log(breederId)
        //   //console.log(toDate,"---",new Date(Date.now()))
        //   //console.log(toDate.getTime() - new Date(Date.now()).getTime())
        //   if(diff <= 0){
        //     return res.json({
        //       status:400,message:"Subscription package is expired",data:{}
        //     });
        //   }
    
        
        
        return next();

   
  });
};


let allowAdmin = (req, res, next) => {
  if(req.user.role.includes('admin')) {
    req.isAuthenticate = true;
    next();
  } else {
    next();
  }
}
let allowBreeder = (req, res, next) => {
  // console.log(req.isAuthenticate)
  //console.log(req.user);
  if(req.user.role.includes('breeder')) {
    req.isAuthenticate = true;
    next();
  } else {
    next();
  }
}

let allowEmployee = (req, res, next) => {
  if(req.user.role.includes('employee')) {
    req.isAuthenticate = true;
    next();
  } else {
    next();
  }
}

let authenticateRole = (req, res, next) => {
  // console.log(req.isAuthenticate);
  if(req.isAuthenticate) return next();  
  //console.log(req.user);
  return res.json({status: 400,message: "Restricted! Unauthorized User", data: {}});
}


async function handleCharge(user,breederId) {
  return new Promise(async (resolve, reject) => {
    await Subscriber.findOne({userId:breederId}).then(
      async result => {
        try{
          if(result && result.toDate <= moment().toDate()){
            const subscription = await Subscription.findById(result.subscriptionId);
            // console.log(subscription,"<<subscription")
            
            const subscriptionAmount = subscription.monthlyPrice ? subscription.monthlyPrice : subscription.lifetimePrice; 
            //  console.log(user.creditCard[0]._id,user.creditCard[0].customer,"<<subscription")
            let charged;
            if(user.creditCard && user.creditCard[0])
            {
            charged=await payment.charge(subscriptionAmount, user.creditCard[0].card.id,user.creditCard[0].customer, 'Charge for subscription' );
            }
            if(charged || (user.creditCard && user.creditCard.length < 1)){
              console.log("inside")
              result.fromDate = new Date();
              result.toDate = subscription.priceMethod === "Lifetime" ? (new Date(new Date().setFullYear(new Date().getFullYear()+100)))
              : (new Date(new Date().setMonth(new Date().getMonth()+1))) 
              result.type = subscription.priceMethod === "Lifetime" ? 'lifetime' : 'monthly'
              
              let updatedSubscriber=await Subscriber.findOneAndUpdate(
                { userId:breederId},
                result,
                { new: true }
              ); 
              resolve(updatedSubscriber)
            }
          }
          else{
            resolve()
          }
        }
        
    catch(err){
      resolve()
      console.log(err,"<---err")
    }
  })

  });
  
}


module.exports = { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole  };