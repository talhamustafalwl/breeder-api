const { User } = require('../models/User');
const { Subscriber } = require('../models/Subscription/Subscriber');

let auth = (req, res, next) => {
  //console.log("auth")
  let token = req.headers['auth'];
  if(!token){
    token=req.cookies['w_auth'];
  }
  
  if (!token)
    {return res.status(205).send({ status: 400, message: 'No token provided header(auth).',data:{} });}

  User.findByToken(token, async (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        status:400,isAuth: false,message:"auth token is invalid",data:{}
      });

    req.token = token;
    req.user = user;
    req.isAuthenticate = false;
    if(user.isAdmin) return next();

    if (user.isblocked)
    return res.json({status: 400,message: "blocked by admin",
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
  console.log(req.isAuthenticate)
  console.log(req.user);
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
  console.log(req.isAuthenticate);
  if(req.isAuthenticate) return next();  
  console.log(req.user);
  return res.status(400).json({status: 400,message: "Restricted! Unauthorized User", data: {}});
}

module.exports = { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole  };