const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth, allowAdmin, allowBreeder, authenticateRole } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const { employeesubscriber } = require("../middleware/empsubscriber");
const mailer = require('../misc/mailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require("../config/key");
const registeremail = require('../emails/register');
const forgetpasswordemail = require('../emails/forgetpassword');
const passwordchangedemail = require('../emails/passwordchanged');
const UserController = require('../controller/user.controller');
const SubscriberController = require('../controller/subscriber.controller');

// Load input validation
const { validateLoginInput, validateRegisterInput, validateRegisterInputEmp } = require("../validation/users");




router.get('/allusers', (req, res) => {
  User.find().then(result  => {
    res.status(200).send({status: 200, result});
  });
});


//auth route check
router.get("/auth",auth, UserController.authentication);
router.patch("/isblocked/:id",adminauth, UserController.isblocked);


// Employees ---------------------------------------------------------------------------
router.get('/employees/all', auth, allowAdmin, allowBreeder, authenticateRole, UserController.getAllEmployees);
// Register Employee only .. By Breeder..
// employeesubscriber //// Will manage subscribe later.. 
router.post("/employee/register", auth, allowAdmin, allowBreeder, authenticateRole, UserController.registerEmployees);
// -------------------------------------------------------------------------------------
router.put("/employee/:id", auth, allowAdmin, allowBreeder, authenticateRole, UserController.editEmployee);

// Breeders ----------------------------------------------------------------------------
// Register Breeder only .. Using portal
router.post("/breeder/register", UserController.registerBreeder);

router.post("/emailCheck", (req, res) => {
  console.log("emailCheck called",req.body)
  if(!req.body.email){
    return res.json({status: 400, message: "Email is required", data: {}});
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user)
    {
      return res.json({status: 400, message: "Email is already registered", data: {}});
    }
    else{
      return res.status(200).json({ status: 200, message: "Email is not registered", data: {} });
    }
   } )}
)

router.get('/verify/:id', async (req, res, next) => {
  //console.log("called verify")
  try {
    const secretToken = req.params.id;
    // Find account with matching secret token
    const user = await User.findOne({ 'secretToken': secretToken });
    if (!user) {
      return res.json({ status: 404, message: "Invalid secret token", data: {} });
    }
    user.verified = true;
    user.secretToken = '';

    //default subscriber Package
    if(user.role == "breeder"){
      SubscriberController.createdefault(user)
    }
    ///
    await user.save();
    return res.status(200).json({ status: 200, message: "Account is verified", data: {} });

  } catch (error) {
    next(error);
  }
})

router.post("/login", (req, res) => {
  //console.log("login called")
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json({ status: 400, message: "Please fill all the required fields", errors: errors, data: {} });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        status: 400, message: "Auth failed, email not found", data: {}
      });

    if (!user.verified)
      return res.json({
        status: 400, message: "Kindly verify your email", data: {}
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ status: 400, message: "Incorrect password", errors: errors, data: {} });

      user.generateToken((err, user) => {
        if (err) return res.send(err);
        //io.emit("userSet", { msg: "email is registered", email: req.body.email });


        return res.cookie("w_auth", user.token)
          .status(200)
          .json({
            status: 200, message: "Login successfully", data: { userId: user._id, token: user.token, email: user.email }
          });
      });
    });
  });
});


router.get("/logout", auth, (req, res) => {
  User.updateOne({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true, status: 200, message: "logout successfully", data: {}
    });
  });
});


router.post("/forgetpassword", UserController.forgotPassword);
router.get('/isForgotTokenActive', UserController.isForgotTokenActive);
router.post('/resetForgotPassword', UserController.resetForgotPassword);


// router.get('/forgetpassword/:token', (req, res) => {
//   User.findOne({
//     resetToken: req.params.token
//   }).then((data) => {
//     return res.status(200).json({
//       status: 200, message: 'reset token is valid', data: data
//     })
//   }
//   ).catch((err) => {
//     return res.json({
//       status: 400, message: 'Password reset token is invalid or has expired.', data: err
//     })
//   }
//   )
// })

// router.post('/forgetpassword/:token', async (req, res) => {
//   User.findOne({
//     resetToken: req.params.token
//     //resetToken_expires: {
//     //  $gte: Date.now()
//     //}
//   }).exec(async function (err, user) {
//     if (!err && user) {
//       if (!user.active) {
//         return res.send({
//           status: 400, message: 'Please activate your account first', data: {}
//         });
//       }

//       if (!req.body.password || !req.body.password2) {
//         return res.send({
//           status: 400, message: 'Please fill password fields', data: {}
//         });
//       }

//       if (req.body.password === req.body.password2) {

//         var password = await bcrypt_password(req.body.password)
//         user.password = password
//         user.resetToken = "";
//         user.resetTokenExp = "";
//         await user.save(function (err) {
//           if (err) {
//             return res.status(422).send({
//               message: err
//             });
//           } else {

//             let html = passwordchangedemail()
//             mailer.sendEmail(config.mailthrough, user.email, 'Password reset successfully', html);

//             return res.status(200).json({
//               status: 200, message: 'Password reset succeesfully', data: {}
//             });
//           }
//         });
//       } else {
//         return res.status(422).json({
//           status: 422, message: 'Password fileld not match', data: {}
//         });
//       }
//     } else {
//       return res.json({
//         status: 400, message: 'Password reset token is invalid or has expired.', data: {}
//       });
//     }
//   });
// })


function bcrypt_password(password) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return res.send({ status: 400, message: 'error in bcrypt', data: err });

    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return res.send({ status: 400, message: 'error in bcrypt', data: err });
      password = hash
    })

  })

  return password
}
module.exports = router;
