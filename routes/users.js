const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const mailer = require('../misc/mailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require("../config/key");
const registeremail = require('../emails/register');
const forgetpasswordemail = require('../emails/forgetpassword');
const UserController = require('../controller/user.controller');

// Load input validation
const { validateLoginInput, validateRegisterInput } = require("../validation/users");

//auth route check
router.get("/auth", UserController.authentication);




router.post("/register", (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
  }
  const user = new User(req.body);
  user.secretToken = randomstring.generate();
  user.save((err, doc) => {
    if (err) return res.status(201).json({ status: 400, message: "email is already registered", errors: err, data: {} });

    const html = registeremail(doc.secretToken, config.Server)
    mailer.sendEmail('admin@breeder.com', doc.email, 'Please verify your email!', html);

    return res.status(200).json({ status: 200, message: "Verification email is send", data: doc });
  });
});



router.get('/verify/:id', async (req, res, next) => {
  try {
    const secretToken = req.params.id;
    // Find account with matching secret token
    const user = await User.findOne({ 'secretToken': secretToken });
    if (!user) {
      return res.status(404).json({ status: 404, message: "Invalid secret token", data: {} });
    }
    user.active = 1;
    user.secretToken = '';
    await user.save();
    return res.status(200).json({ status: 200, message: "Account is verified", data: {} });

  } catch (error) {
    next(error);
  }
})

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json({ status: 400, message: "please fill all the required fields", errors: errors, data: {} });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        status: 400, message: "Auth failed, email not found", data: {}
      });

    if (user.active == 0)
      return res.json({
        status: 400, message: "Kindly verify your email", data: {}
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ status: 400, message: "Incorrect password", errors: errors, data: {} });

      user.generateToken((err, user) => {
        if (err) return res.send(err);
        //io.emit("userSet", { msg: "email is registered", email: req.body.email });


        res.cookie("w_auth", user.token)
          .status(200)
          .json({
            status: 200, message: "login successfully", data: { userId: user._id, token: user.token, email: user.email }
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


router.post("/forgetpassword", (req, res, next) => {
  if (!req.body.email) {
    return res.json({ status: 400, email: "Email field is required", data: {} });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.json({ status: 400, email: "Email not exists", data: {} });
    }
    //check for active user
    if (user.active == 0)
      return res.json({
        status: 400, message: "Kindly verify your email first", data: {}
      });
    //
    const token = randomstring.generate()
    user.resetToken = token;
    //user.resetToken_expires=Date.now();
    user.save()
    //email send
    let html = forgetpasswordemail(req.body.email, config.Server, token)
    mailer.sendEmail('admin@breeder.com', req.body.email, 'Password reset instructions', html);
    //

    res.status(200).json({ status: 200, message: "email is send to recover password", data: { id: user._id, resettoken: user.resetToken } });

  })
})

router.get('/forgetpassword/:token', (req, res) => {
  User.findOne({
    resetToken: req.params.token
  }).then((data) => {
    return res.status(200).json({
      status: 200, message: 'reset token is valid', data: data
    })
  }
  ).catch((err) => {
    return res.json({
      status: 400, message: 'Password reset token is invalid or has expired.', data: err
    })
  }
  )
})

router.post('/forgetpassword/:token', async (req, res) => {
  User.findOne({
    resetToken: req.params.token
    //resetToken_expires: {
    //  $gte: Date.now()
    //}
  }).exec(async function (err, user) {
    if (!err && user) {
      if (!user.active) {
        return res.send({
          status: 400, message: 'Please activate your account first', data: {}
        });
      }

      if (!req.body.password || !req.body.password2) {
        return res.send({
          status: 400, message: 'Please fill password fields', data: {}
        });
      }

      if (req.body.password === req.body.password2) {

        var password = await bcrypt_password(req.body.password)
        user.password = password
        user.resetToken = "";
        user.resetTokenExp = "";
        await user.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {

            let html = `Hi there,
              <br/>
              <div>
              
              <p>Your Password changed successfully</p>
              <br>
              <p>Cheers!</p>
              </div>`
            mailer.sendEmail('admin@breeder.com', user.email, 'Password reset successfully', html);

            return res.status(200).json({
              status: 200, message: 'Password reset succeesfully', data: {}
            });
          }
        });
      } else {
        return res.status(422).json({
          status: 422, message: 'Password fileld not match', data: {}
        });
      }
    } else {
      return res.json({
        status: 400, message: 'Password reset token is invalid or has expired.', data: {}
      });
    }
  });
})


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
