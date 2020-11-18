const { User } = require('../models/User');
const { Subscriber } = require('../models/Subscription/Subscriber');

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
  console.log(req.isAuthenticate)
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
  console.log(req.isAuthenticate);
  if(req.isAuthenticate) return next();  
  //console.log(req.user);
  return res.json({status: 400,message: "Restricted! Unauthorized User", data: {}});
}

module.exports = { auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole  };