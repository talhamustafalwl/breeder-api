const { User } = require('../models/User');

let auth = (req, res, next) => {
  //console.log("auth")
  let token = req.headers['auth'];
  if(!token){
    token=req.cookies['w_auth'];
  }
  
  if (!token)
    {return res.status(205).send({ status: 400, message: 'No token provided header(auth).',data:{} });}

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
    
      return res.json({
        status:400,isAuth: false,
        message:"auth token is invalid",
        data:{}
      });
   
    req.token = token;
    req.user = user;
    
    next();
  });
};

module.exports = { auth };