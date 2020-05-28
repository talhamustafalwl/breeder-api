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

      if (user.isblocked)
      return res.json({status: 400,message: "blocked by admin",
        data: {}});
    
    ///subscribtion date validation (block apis after trial period)
      breederId=user.role == "employee" ? user.breederId : user._id
      
        const toDate=await Subscriber.findOne({breederId}).then(
          result=> result.toDate
      )
      diff=toDate.getTime() - new Date(Date.now()).getTime()
      //console.log(breederId)
      //console.log(toDate,"---",new Date(Date.now()))
      //console.log(toDate.getTime() - new Date(Date.now()).getTime())
      if(diff <= 0){
        return res.json({
          status:400,message:"Subscription package is expired",data:{}
        });
      }

    req.token = token;
    req.user = user;
    
    next();
  });
};

module.exports = { auth };