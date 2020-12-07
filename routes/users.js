const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth, allowAdmin, allowBreeder, authenticateRole, allowEmployee } = require("../middleware/auth");
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
const {upload, uploadDocument} = require('../middleware/multerimage');
const { checkSubscriptionLimit } = require('../middleware/subscriptionLimit');

// Load input validation
const { validateLoginInput, validateRegisterInput, validateRegisterInputEmp } = require("../validation/users");
const { registerUserWithRole } = require('../controller/user.controller');




router.get('/allusers', auth, allowAdmin, authenticateRole, UserController.getAllUsers);
router.get('/detail/:id', auth, allowAdmin, authenticateRole, UserController.getUserDetailById);



router.get('/dashboardAnalysis', auth , allowBreeder, allowAdmin, authenticateRole, UserController.dashboardAnalysis)



//auth route check
router.get("/auth", auth, allowBreeder, allowAdmin,allowEmployee, authenticateRole, UserController.authentication);
router.patch("/isblocked/:id", adminauth, UserController.isblocked);


// Employees ---------------------------------------------------------------------------
router.get('/employees/all', auth, allowAdmin, allowBreeder, authenticateRole, UserController.getAllEmployees);
router.get('/breeders/all', auth, allowAdmin, allowBreeder,allowEmployee, authenticateRole, UserController.getBreederForSales);

router.get('/employee/:id', auth, allowAdmin, allowBreeder, authenticateRole, UserController.getEmployeeById);
router.get('/breeder/employees', (req, res, next) => {console.log('calling breeder/employees');  return next();}, auth, allowBreeder, authenticateRole, UserController.getEmployeeByBreeder);
router.post('/employee/changePassword', auth , allowEmployee, allowBreeder, allowAdmin, authenticateRole, UserController.changePasswordEmp);


router.post('/setupwizard', auth, allowBreeder, authenticateRole, UserController.setupWizard)

router.post("/image/upload", auth, allowAdmin, allowBreeder, authenticateRole, upload.single('file'), UserController.updateImage);


// Register Employee only .. By Breeder..
// employeesubscriber //// Will manage subscribe later.. 
router.post("/employee/register", auth, allowAdmin, allowBreeder, authenticateRole,    (req, res, next) => { req.type='employee'; return next();},  checkSubscriptionLimit, upload.single('file'), UserController.registerEmployees);
router.delete("/employee/:id", auth, allowAdmin, allowBreeder, authenticateRole, UserController.deleteEmployee);

// -------------------------------------------------------------------------------------
router.put("/employee/:id", auth, allowAdmin, allowBreeder, authenticateRole, upload.single('file'), UserController.editEmployee);


// Breeders ----------------------------------------------------------------------------
// Register Breeder only .. Using portal
router.post("/breeder/register", UserController.registerBreeder);
router.post("/credit-card", auth, allowAdmin, allowBreeder, authenticateRole, UserController.addCreditCard);
router.get("/breeder/getTax", auth, allowBreeder, allowEmployee, allowAdmin, authenticateRole, UserController.getTaxofBreeder)
router.delete("/breeder/:id", auth, allowAdmin, allowBreeder, authenticateRole, UserController.deleteBreeder);
router.get("/approve/breeder/:id", auth, allowAdmin,  authenticateRole, UserController.approveBreeder);

router.post('/gallery/upload', auth, allowBreeder, allowEmployee, authenticateRole, upload.array('file', 10),  UserController.uploadGalleryImage )
router.put('/gallery/delete', auth, allowBreeder, allowEmployee, authenticateRole, UserController.deleteGallaryImage)


router.post('/dealcategories', auth, allowAdmin, allowBreeder, authenticateRole, UserController.addDealCategories)
router.delete('/dealcategories/:id', auth, allowAdmin, allowBreeder, authenticateRole, UserController.deleteDealCategories)
router.get('/itemCount', auth, allowAdmin, allowEmployee, allowBreeder, authenticateRole, UserController.getItemsCount)


router.get('/adminDashboardStatics',  UserController.adminDashboardStatics)


router.post("/emailCheck", (req, res) => {
  console.log("emailCheck called", req.body)
  if (!req.body.email) {
    return res.json({ status: 400, message: "Email is required", data: {} });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      return res.json({ status: 400, message: "Email is already registered", data: {} });
    }
    else {
      return res.status(200).json({ status: 200, message: "Email is not registered", data: {} });
    }
  })
}
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
    if (user.role == "breeder") {
      SubscriberController.createdefault(user)
    }
    ///
    await user.save();
    return res.status(200).json({ status: 200, message: "Account is verified", data: {} });

  } catch (error) {
    next(error);
  }
})


router.post('/testLogin', (req, res) => {
  console.log('test login called');
  return res.status(200).json({
            status: 200, message: "Login successfully"});
});


router.get('/testMail' , UserController.testSendMail);
router.get('/testcheck', (req, res) => {
  console.log('url');
  console.log(typeof req.method);
  res.send('OK')
})

router.post('/employee/login', UserController.employeeLogin);


router.post("/login", (req, res) => {
  console.log('calling login',req.body);
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json({ status: 400, message: "Please fill all the required fields", errors: errors, data: {} });
  }
  User.findOne({ email: req.body.email, role: req.body.role }, (err, user) => {
    if (!user)
      return res.json({
        status: 400, message: "Email not found", data: {}
      });
      console.log(user.verified)
    if (!user.verified)
      return res.json({
        status: 400, message: "Kindly verify your email", data: {}
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ status: 400, message: "Incorrect email id or password", errors: errors, data: {} });

      user.deviceToken = req.body.deviceToken;
      user.generateToken((err, user) => {
        if (err) return res.send(err);
        //io.emit("userSet", { msg: "email is registered", email: req.body.email });

       
        return res.status(200)
          .json({
            status: 200, message: "Login successfully", data: { userId: user._id, token: user.token, email: user.email, user }
          });
      });
    });
  });
});


router.get("/logout", auth, allowAdmin, allowBreeder, allowEmployee, authenticateRole, (req, res) => {
  console.log('logout called');
  User.updateOne({ _id: req.user._id }, { token: "", tokenExp: "", deviceToken: "" }, (err, doc) => {
    if (err) return res.json({ success: false, status: 400, err, message: "logout error" , data: {}});
    return res.status(200).json({
      success: true, status: 200, message: "logout successfully", data: {}
    });
  });
});


router.post("/forgetpassword", UserController.forgotPassword);
router.get('/isForgotTokenActive', UserController.isForgotTokenActive);
router.post('/resetForgotPassword/:token', UserController.resetForgotPassword);
router.get('/', auth, allowBreeder, allowAdmin, authenticateRole, UserController.getUserDetail);
router.put('/', auth, allowBreeder, allowAdmin, authenticateRole, UserController.updateUser);


router.post('/force_verify', (req, res, next) => {
  User.updateOne({ email: req.body.email }, { $set: { verified: true } }).then(result => {
    return res.status(200).json({
      success: true, status: 200, message: "Verified successfully", data: {}
    });
  })
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
