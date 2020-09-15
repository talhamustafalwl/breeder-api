const { User } = require('../models/User');

let adminauth = (req, res, next) => {

  let token = req.headers['auth'];
  if (!token) {
    token = req.cookies['w_auth'];
  }

  if (!token || token === undefined) {
    console.log('no token provided');
    return res.status(205).send({ status: 400, message: 'No token provided header(auth).', data: {} });
  }
  //console.log(token)
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        status: 400, isAuth: false,
        message: "auth token is invalid",
        data: {}
      });

    if (!user.isAdmin)

      return res.json({
        status: 400, isAuth: false,
        message: "not authorized",
        data: {}
      });

    req.token = token;
    req.user = user;
    
    next();
  });
};

module.exports = { adminauth };