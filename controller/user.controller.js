const { User } = require("../models/User");
const passwordGenerator = require("../config/passwordGenerator");

const {
  validateLoginInput,
  validateRegisterInput,
  validateRegisterInputEmp,
  validateRegisterInputBreeder,
  validateResetPassword,
} = require("../validation/users");
const mailer = require("../misc/mailer");
const randomstring = require("randomstring");
const { Animal } = require("../models/Animal/Animal");
const { Product } = require("../models/Product");
const { Subscriber } = require("../models/Subscription/Subscriber");
const { BusinessDetail } = require("../models/BusinessDetail");
const { Form } = require("../models/Form/Form");
const { Sale } = require("../models/Sales");

const config = require("../config/key");
const registeremail = require("../emails/register");
const resendVerification = require("../emails/resendVerification");
const registeremailMobile = require("../emails/registerMobile");
const registerCharity = require("../emails/registerCharity");
const registerCharityMobile = require("../emails/registerCharityMobile");
const adminCharity = require("../emails/adminCharity");
const employeeEmail = require("../emails/employeeRegister");
const RegisterNewBreeder = require("../emails/RegisterNewBreeder");

const forgetpasswordemail = require("../emails/forgetpassword");
// const formController = require("./form.controller");
const { removeQuote } = require("../middleware/constant");
const { Types } = require("mongoose");
const notificationController = require("./notification.controller");
const salesController = require("./sales.controller");
const { reject } = require("async");
const subscriberController = require("./subscriber.controller");
const payment = require("../misc/payment");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
require("dotenv").config();

// var superagent = require('superagent');
// var mailchimpInstance   = 'us1',
//     listUniqueId        = '7e53e2afa6',
//     mailchimpApiKey     = '99525a128cda82bb5d6e1037a8f98fca-us1';

let updater = null;
class UserController {
  constructor() {
    this.registerUserWithRole = this.registerUserWithRole.bind(this);
    this.registerBreeder = this.registerBreeder.bind(this);
    this.registerEmployees = this.registerEmployees.bind(this);
    this.setupWizard = this.setupWizard.bind(this);
    this.setupWizard2 = this.setupWizard2.bind(this);
    this.sendSms = this.sendSms.bind(this);
    this.forgetpasswordphone = this.forgetpasswordphone.bind(this);
    this.resendCodeVerificationSms = this.resendCodeVerificationSms.bind(this);
    this.resendVerificationCodes = this.resendVerificationCodes.bind(this);
  }

  async registerUserWithRole(body, role, token = false, files = []) {
    console.log("register with role");
    return new Promise((resolve, reject) => {
      // console.log(token);
      const user = new User({
        ...body,
        ...{ role: role },
      });
      if (token) user.secretToken = randomstring.generate();
      user.save((err, doc) => {
        console.log(err);
        if (err)
          reject({
            error: err,
            response: {
              status: 400,
              message: "Email is already registered",
              errors: err,
              data: {},
            },
          });

        console.log("docc:", doc);

        //Send sms if smscode
        if (body.smscode && body.phone) {
          this.sendSmsHelper(
            body.phone,
            process.env.TWILIO_REGISTRATION_MSG + body.smscode
          )
            .then((send) => console.log("registration sms send", send))
            .catch((err) => console.log("registration sms error", err));
        }

        // Send email to breeder..
        // Email is pending for later use..
        if (token) {
          if (body.packageType && body.packageType === "Charity Organization") {
            const html = body.mobile
              ? registerCharityMobile(
                  body.mobile,
                  role,
                  body.uid,
                  files,
                  config.basecharityDoc
                )
              : registerCharity(
                  doc.secretToken,
                  config.webServer,
                  role,
                  body.uid,
                  files,
                  config.basecharityDoc
                );
            mailer.sendEmail(
              config.mailthrough,
              doc.email,
              "Please verify your email!",
              html
            );

            const html2 = adminCharity(
              doc.email,
              config.webServer,
              role,
              body,
              files,
              config.basecharityDoc
            );
            mailer.sendEmail(
              config.mailthrough,
              config.mailFeedback,
              "Charity Acc!",
              html2
            );

            console.log("sending emails");
            return resolve({
              status: 200,
              message: "Verification email is send",
              data: doc,
            });
          } else if (body.mobile) {
            const html = registeremailMobile(body.uid, body.mobile);
            mailer.sendEmail(
              config.mailthrough,
              doc.email,
              "Please verify your email!",
              html
            );
            return resolve({
              status: 200,
              message: "Verification email is send",
              data: doc,
            });
          } else {
            const html = registeremail(
              doc.secretToken,
              config.webServer,
              role,
              body.uid
            );
            mailer.sendEmail(
              config.mailthrough,
              doc.email,
              "Please verify your email!",
              html
            );
            console.log("sending email");
            return resolve({
              status: 200,
              message: "Verification email is send",
              data: doc,
            });
          }
        } else {
          if (role === "employee") {
            console.log("employee email");
            console.log(body);
            const html = employeeEmail(body.breederUniqueId, body.email);
            mailer.sendEmail(
              config.mailthrough,
              body.email,
              "Email for logly employee",
              html
            );
            console.log("sending email");
          } else if (role === "breeder") {
            // email for breeder when added by breeder.....
            console.log(body.email);
            const html = RegisterNewBreeder(body.email);
            mailer.sendEmail(
              config.mailthrough,
              body.email,
              "Email for logly Breeder",
              html
            );
          }
          return resolve({
            status: 200,
            message: "Registered Successfully",
            data: doc,
          });
        }
      });
    });
  }

  async getAllUsers(req, res, next) {
    try {
      User.find({
        ...(req.query.role && req.query.role != "all"
          ? { role: req.query.role }
          : {}),
        ...(req.user.isAdmin ? {} : { breederId: req.user._id }),
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "activeSubscription",
          populate: {
            path: "subscriptionId",
          },
        })
        .then((result) => {
          return res.status(200).json({
            status: 200,
            message: "Employee found successfully",
            data: result.map((e) => ({
              ...e.toObject(),
              ...{
                image: e.toObject().image
                  ? `${config.baseImageURL}${e.toObject().image}`
                  : null,
              },
            })),
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error fetching employees",
            errors: error,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  async getUserDetailById(req, res, next) {
    try {
      //   User.findById(req.params.id).
      //   populate({
      //     path: "activeSubscription",
      //     populate: {
      //       path: "subscriptionId",
      //     },
      //   }).
      User.aggregate([
        { $match: { _id: Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "animals",
            localField: "_id",
            foreignField: "breederId",
            as: "animals",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "breederId",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "breederId",
            as: "employees",
          },
        },
      ]).then((result) => {
        User.populate(
          result,
          {
            path: "activeSubscription",
            populate: {
              path: "subscriptionId",
            },
          },
          (err, resultFinal) => {
            return res.status(200).json({
              status: 200,
              message: "Employee found successfully",
              // data: result,
              data: {
                ...resultFinal[0],
                ...{
                  image: resultFinal[0].image
                    ? `${config.baseImageURL}${resultFinal[0].image}`
                    : null,
                },
                animals: resultFinal[0].animals.map((e) => ({
                  ...e,
                  image: e.image ? `${config.baseImageURL}${e.image}` : null,
                })),
                products: resultFinal[0].products.map((e) => ({
                  ...e,
                  image: e.image ? `${config.baseImageURL}${e.image}` : null,
                })),
                employees: resultFinal[0].employees.map((e) => ({
                  ...e,
                  image: e.image ? `${config.baseImageURL}${e.image}` : null,
                })),
              },
            });
          }
        );
      });
    } catch (error) {
      return next(error);
    }
  }

  async authentication(req, res, next) {
    let countallowed;
    countallowed = await Subscriber.findOne({
      userId: req.user.breederId ? req.user.breederId : req.user._id,
    }).populate("subscriptionId");

    try {
      return res.status(200).json({
        status: 200,
        message: "auth user success",
        isAuth: true,
        isAdmin: req.user.role[0] === "admin" ? true : false,
        data: {
          _id: req.user._id,
          uid: req.user.uid,
          breederUniqueId: req.user.breederUniqueId
            ? req.user.breederUniqueId
            : null,
          email: req.user.email,
          name: req.user.name,
          businessName: req.user.businessName,
          breederId: req.user.breederId,
          image: req.user.image
            ? `${config.baseImageURL}${req.user.image}`
            : null,
          setupWizardCompleted: req.user.setupWizardCompleted,
          notificationSettings: req.user.notificationSettings,
          creditCard: req.user.creditCard,
          businessInfoSettings: req.user.businessInfoSettings,
          socialConnects: req.user.socialConnects,
          paymentInformation: req.user.paymentInformation,
          subscriber: countallowed ? countallowed : {},
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllEmployeesOfBreeder(breederId) {
    return new Promise((resolve, reject) => {
      User.find({ breederId, role: "employee" })
        .then((allEmployees) => {
          resolve(allEmployees);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async employeeLogin(req, res, next) {
    //console.log(req.body);
    try {
      const { errors, isValid } = validateLoginInput(req.body);
      //console.log(req.body);
      // Check validation
      if (!isValid) {
        return res.json({
          status: 400,
          message: "Please fill all the required fields",
          errors: errors,
          data: {},
        });
      }

      let user = await User.findOne({
        email: req.body.email,
        uid: req.body.uid,
      });
      if (!user) {
        user = await User.findOne({
          email: req.body.email,
          breederUniqueId: req.body.uid,
        });
        if (!user) {
          return res.json({
            status: 400,
            message: "Please enter your valid Email /Care Giver ID",
            data: {},
          });
        }
      }
      // console.log( "Breeder==>",user.role.includes("breeder"))
      if (!user.verified && user.role.includes("breeder"))
        return res.json({
          status: 400,
          message: "Kindly verify your email",
          data: user,
        });

      if (!user.isEmployeeActive)
        return res.status(202).json({
          status: 400,
          message: "Breeder removed your account",
          data: {},
        });

      if (user.canAccessMobileApp && user.canAccessMobileApp === false)
        return res.status(202).json({
          status: 400,
          message: "Breeder blocked your account",
          data: {},
        });

      if (user.isblocked)
        return res.status(202).json({
          status: 400,
          message: "Admin blocked your account",
          data: {},
        });

      if (!user.active)
        return res.status(202).json({
          status: 400,
          message: "Breeder disabled your account",
          data: {},
        });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            status: 400,
            message: "Incorrect password",
            errors: errors,
            data: {},
          });
        user.deviceToken = req.body.deviceToken;
        user.save;
        //console.log(user)
        user.generateToken(async (err, user) => {
          if (err) return res.send(err);
          //io.emit("userSet", { msg: "email is registered", email: req.body.email });

          //Subscriber package
          const countallowed = await Subscriber.findOne({
            userId: user.breederId ? user.breederId : user._id,
          }).populate("subscriptionId");

          //BusinessDetails

          // console.log(user.breederId,"countallowed==>>",countallowed)
          return res.status(200).json({
            status: 200,
            message: "Login successfully",
            data: {
              userId: user._id,
              token: user.token,
              email: user.email,
              subscriber: countallowed ? countallowed : {},
            },
          });
        });
      });
    } catch (err) {
      return next(err);
    }
  }

  async isblocked(req, res) {
    console.log(req.body);
    if (!req.body) {
      return res.json({
        status: 400,
        message: "isblocked field is required",
        errors: { file: "isblocked field is required" },
        data: {},
      });
    }
    try {
      if (req.body.isblocked) {
        req.body.token = "";
      }
      const user = await User.updateMany(
        { $or: [{ _id: req.params.id }, { breederId: req.params.id }] },
        req.body
      );
      return res.status(200).json({
        status: 200,
        message: `Breeder and all its employees ${
          req.body.isblocked === false ? "Active" : "Blocked"
        } successfully`,
        data: user,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in blocking Breeder and all its emp",
        errors: err,
        data: {},
      });
    }
  }

  async deleteBreeder(req, res) {
    console.log(req.params.id);
    if (!req.params.id) {
      return res.json({
        status: 400,
        message: "Breeder Id  is required",
        errors: { file: "Breeder Id is required" },
        data: {},
      });
    }
    try {
      const user = await User.deleteMany({
        $or: [{ _id: req.params.id }, { breederId: req.params.id }],
      });
      return res.status(200).json({
        status: 200,
        message: `Breeder and all its employees deleted successfully`,
        data: user,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in blocking Breeder and all its emp",
        errors: err,
        data: {},
      });
    }
  }

  async approveBreeder(req, res) {
    console.log(req.params.id);
    if (!req.params.id) {
      return res.json({
        status: 400,
        message: "Breeder Id  is required",
        errors: { file: "Breeder Id is required" },
        data: {},
      });
    }
    try {
      const user = await User.findOne(
        { _id: req.params.id },
        { isverified: false }
      );
      if (!user) {
        return res.json({
          status: 404,
          message: "Breeder not found / Already approved",
          data: {},
        });
      }
      user.verified = true;
      user.secretToken = "";
      await user.save();
      return res.status(200).json({
        status: 200,
        message: "Breeder verified successfully",
        data: {},
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in verifing breeder",
        errors: err,
        data: {},
      });
    }
  }

  async getAllEmployees(req, res) {
    try {
      User.find({
        ...{ role: "employee" },
        ...(req.user.isAdmin ? {} : { breederId: req.user._id }),
      })
        .then((result) => {
          return res.status(200).json({
            status: 200,
            message: "Employee found successfully",
            data: result.map((e) => ({
              ...e.toObject(),
              ...{
                image: e.toObject().image
                  ? `${config.baseImageURL}${e.toObject().image}`
                  : null,
              },
            })),
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error fetching employees",
            errors: error,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  // async getAllbreeders(req, res) {
  //   try {
  //     User.find({ role: "breeder"}).then(result => {
  //       return res.status(200).json({
  //         status: 200,
  //         message: "Breeder found successfully",
  //         data: result.map((e) => ({
  //           ...e.toObject(),
  //           ...{
  //             image: e.toObject().image
  //               ? `${config.baseImageURL}${e.toObject().image}`
  //               : null,
  //           },
  //         })),
  //       });
  //     })
  //   } catch(error) {
  //     return res.json({
  //       status: 400,
  //       message: "Error fetching breeder",
  //       errors: error,
  //       data: {},
  //     });
  //   }
  // }

  async getBreederForSales(req, res) {
    console.log(req.query, "<--req.query");
    try {
      const keyword = req.query.keyword.replace(/['"]+/g, "");
      if (!keyword) {
        salesController
          .getBreederSalesList(req.user._id)
          .then((resultSales) => {
            User.find({
              $or: [
                { role: "breeder", _id: { $in: resultSales } },
                { role: "breeder", addedBy: req.user._id },
              ],
            })
              .then((result) => {
                return res.status(200).json({
                  status: 200,
                  message: "Breeder found successfully",
                  data: result.map((e) => ({
                    ...e.toObject(),
                    ...{
                      image: e.toObject().image
                        ? `${config.baseImageURL}${e.toObject().image}`
                        : null,
                    },
                  })),
                });
              })
              .catch((error) => {
                return res.json({
                  status: 400,
                  message: "Error fetching breeder",
                  errors: error,
                  data: {},
                });
              });
          });
      } else if (
        (req.query.uid && req.query.uid === "uid") ||
        (!isNaN(keyword) && (keyword.length === 7 || keyword.length === 8))
      ) {
        console.log("<--here1");
        User.find({
          role: "breeder",
          uid: keyword,
        })
          .then((result) => {
            console.log(result.length);
            return res.status(200).json({
              status: 200,
              message: "Breeder found successfully",
              data: result
                .map((e) => ({
                  ...e.toObject(),
                  ...{
                    image: e.toObject().image
                      ? `${config.baseImageURL}${e.toObject().image}`
                      : null,
                  },
                }))
                .filter((e) => !(e._id == req.user._id.toString())),
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Error fetching breeder",
              errors: error,
              data: {},
            });
          });
      } else {
        console.log("<--here2");
        User.find({
          role: "breeder",
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
            { city: { $regex: keyword, $options: "i" } },
            { state: { $regex: keyword, $options: "i" } },
            { phone: { $regex: keyword, $options: "i" } },
          ],
        })
          .then((result) => {
            console.log(req.user._id);
            return res.status(200).json({
              status: 200,
              message: "Breeder found successfully",
              data: result
                .map((e) => ({
                  ...e.toObject(),
                  ...{
                    image: e.toObject().image
                      ? `${config.baseImageURL}${e.toObject().image}`
                      : null,
                  },
                }))
                .filter((e) => !(e._id == req.user._id.toString())),
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Error fetching breeder",
              errors: error,
              data: {},
            });
          });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error fetching breeder",
        errors: error,
        data: {},
      });
      // return next(err);
    }
  }

  async getEmployeeById(req, res, next) {
    console.log("called", req.params.id);
    try {
      // User.findOne({ role: 'employee', _id: req.params.id }).then(result => {
      //     return res.status(200).json({ status: 200, message: "Employee found successfully", data: {...result.toObject(), ...{image:  result.toObject().image ? `${config.baseImageURL}${result.toObject().image}`: null}}});
      // }).catch(error => {
      //     return res.json({ status: 400, message: "Error fetching employees", errors: error, data: {} });
      // });
      User.aggregate([
        { $match: { role: "employee", _id: Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "animals",
            localField: "breederId",
            foreignField: "breederId",
            as: "animalData",
          },
        },
      ])
        .exec()
        .then((result) => {
          console.log(result);
          return res.status(200).json({
            status: 200,
            message: "Employee found successfully",
            data: {
              ...result[0],
              ...{
                image: result[0].image
                  ? `${config.baseImageURL}${result[0].image}`
                  : null,
              },
            },
          });
        })
        .catch((error) => {
          console.log(error);
          return res.json({
            status: 400,
            message: "Error fetching employees",
            errors: error,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  async getEmployeeByBreeder(req, res, next) {
    console.log("breeder employee called");
    console.log(req.user._id);
    try {
      User.find({
        role: "employee",
        breederId: req.user._id,
        isEmployeeActive: true,
      })
        .sort({ createdAt: -1 })
        .then((result) => {
          console.log(result);
          return res.status(200).json({
            status: 200,
            message: "Employee found successfully",
            data: result.map((e) => ({
              ...e.toObject(),
              ...{
                image: e.toObject().image
                  ? `${config.baseImageURL}${e.toObject().image}`
                  : null,
              },
            })),
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error fetching employees",
            errors: error,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  async changePasswordEmp(req, res, next) {
    console.log("changePasswordEmp employee", req.body);
    console.log(req.user._id);
    try {
      User.findById(req.user._id)
        .then((result) => {
          if (result) {
            result.comparePassword(req.body.password, (err, isMatch) => {
              if (!isMatch) {
                return res.json({
                  status: 400,
                  message: "Existing password is incorrect",
                  data: {},
                });
              } else {
                if (req.body.changePassword === req.body.password) {
                  return res.json({
                    status: 400,
                    message:
                      "New password and Current Password must be different",
                    data: {},
                  });
                }
                result.password = req.body.changePassword;
                result.save().then((resultSaved) => {
                  res.status(200).json({
                    status: 200,
                    message: "Password changed successfully",
                    data: {},
                  });
                });
              }
            });
          } else {
            return res
              .status(200)
              .json({ status: 200, message: "Employee not found", data: {} });
          }
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in Password Changed",
            errors: error,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  // async removeEmployee(req, res, next) {
  //     try {
  //         User.updateOne({email: req.body.email}, {$set: {isEmployeeActive: true}}).then(updatedUser => {
  //             console.log(updatedUser);
  //             return resolve({status: 200, message: "Registered Successfully"});
  //         }).catch(error => {
  //             return reject(error);
  //         });
  //     } catch(err) {
  //         return next(err);
  //     }
  // }

  async regEmployees(req, res, next) {
    // console.log("dataaaa", data);
    try {
      // Check is employee, isadmin and email is exist.. Manually
      // user.findByEmailAndRoleNotAdmin(req.body.email, req.bodly.role, ())
      // if email exist then add role

      // if email donot exist then create user.
      console.log("Inside reg employeeee");
      if (!(req.body.email === req.user.email)) {
        // const data = JSON.parse(req.body.data);
        // req.body.email = data.email;

        User.findOne({
          email: req.body.email,
          role: "employee",
          breederId: req.user._id,

          //isEmployeeActive: true,
        }).then((resultUser) => {
          console.log(resultUser + "result user");
          if (!resultUser) {
            req.body.breederUniqueId = req.user.uid;
            // Register user...
            req.body.breederId = req.user._id;
            req.body.image = req.file ? req.file.filename : null;
            // req.body.emergencyContact = JSON.parse(req.body.emergencyContact);
            console.log("req.body", req.body);
            this.registerUserWithRole(req.body, "employee", false)
              .then((success) => {
                console.log(("success", success));

                notificationController
                  .create(
                    req.user._id,
                    "mynotification",
                    "employee",
                    "Employee Registered Successfully",
                    "You have registered a new employee",
                    req.user._id,
                    null,
                    success.data._id,
                    req.user.deviceToken,
                    true
                  )
                  .then((resultNotifCreate) => {
                    console.log(resultNotifCreate);
                  });
                return res.status(200).send({
                  status: 200,
                  message: "Employee Registered Successfully",
                  data: success,
                });
              })
              .catch((error) => {
                console.log(error);
                return res.json({
                  status: 400,
                  message: "Something wents wrong",
                });
              });
          } else {
            return res
              .status(200)
              .json({ status: 400, message: "Employee is already registered" });
          }
        });
      } else {
        return res.status(200).json({
          status: 400,
          message: "You are not allowed to register yourself as employee",
        });
      }
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async registerEmployees(req, res, next) {
    try {
      // const { errors, isValid } = validateRegisterInputEmp(req.body);
      // Check validation
      // if (!isValid) {
      //   return res.json({
      //     status: 400,
      //     message: "errors present",
      //     errors: errors,
      //     data: {},
      //   });
      // }
      // if (req.body.role == "employee") {

      //   }
      //   else {
      //     const { errors, isValid } = validateRegisterInput(req.body);
      //     // Check validation
      //     if (!isValid) {
      //       return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      //     }
      //   }

      // Check is employee, isadmin and email is exist.. Manually
      // user.findByEmailAndRoleNotAdmin(req.body.email, req.bodly.role, ())
      // if email exist then add role

      // if email donot exist then create user.
      console.log("Inside register employeeee");
      console.log(
        "req.body.email === req.user.email",
        req.body.email === req.user.email
      );
      if (!(req.body.email === req.user.email)) {
        // const data = JSON.parse(req.body.data);

        // const passw = passwordGenerator.generate(10);
        User.findOne({
          email: req.body.email,
          role: "employee",
          breederId: req.user._id,

          //isEmployeeActive: true,
        }).then(async (resultUser) => {
          console.log(resultUser + "result user");
          if (!resultUser) {
            req.body.breederUniqueId = req.user.uid;
            // Register user...
            req.body.breederId = req.user._id;
            // req.body.data = JSON.parse(req.body.data);
            req.body.image = req.file ? req.file.filename : null;

            req.body.emergencyContact = JSON.parse(req.body.emergencyContact);
            await this.registerUserWithRole(req.body, "employee", false)
              .then((success) => {
                console.log(("success", success));

                notificationController
                  .create(
                    req.user._id,
                    "mynotification",
                    "employee",
                    "Employee Registered Successfully",
                    "You have registered a new employee",
                    req.user._id,
                    null,
                    success.data._id,
                    req.user.deviceToken,
                    true
                  )
                  .then((resultNotifCreate) => {
                    console.log(resultNotifCreate);
                  });
                return res.status(200).send({
                  status: 200,
                  message: "Employee Registered Successfully",
                  data: success,
                });
              })
              .catch((error) => {
                console.log(error);
                return res.json({
                  status: 400,
                  message: "Something wents wrong",
                });
              });
          } else {
            return res
              .status(200)
              .json({ status: 400, message: "Employee is already registered" });
          }

          // else if(resultUser.role.includes('admin')) {
          //     return res.json({ status: 400, message: "Wrorng Email" });
          // } else if(resultUser.role.includes('employee')) {
          //     if(resultUser.isEmployeeActive === false) {
          //         User.updateOne({email: req.body.email}, {$set: {isEmployeeActive: true}}).then(updatedUser => {
          //             console.log(updatedUser);
          //             return res.status(200).send({status: 200, message: "Registered Successfully"});
          //         }).catch(error => {
          //             return res.status(400).json({status: 400, message: "Internal Server Error"});
          //         })
          //     } else {
          //         return res.json({ status: 400, message: "Email is already registered as employee" });
          //     }
          // } else {
          //     console.log('Updating user');
          //     req.body.uid = randomstring.generate({length: 8, charset: 'numeric'});
          //     req.body.breederId = req.user._id;
          //     req.body.isEmployeeActive = true;
          //     // Modify user to register breeder..
          //     this.modifyUserWithRole(req.body.email, req.body, 'employee').then(resultUser => {
          //         return res.status(200).send(resultUser);
          //     }).catch(error => {
          //         console.log(error);
          //         return res.status(400).json({ status: 400, message: "Internal Server Error" });
          //     })
          // }
        });

        // const user = new User({...req.body, ...{role: 'employee'}});
        // user.secretToken = randomstring.generate();
        // user.save((err, doc) => {
        //     if (err) return res.status(201).json({ status: 400, message: "Email is already registered", errors: err, data: {} });

        //     // Email is pending for later use..
        //     const html = registeremail(doc.secretToken, config.Server)
        //     mailer.sendEmail(config.mailthrough, doc.email, 'Please verify your email!', html);
        //     return res.status(200).json({ status: 200, message: "Verification email is send", data: doc });
        // });
      } else {
        return res.status(200).json({
          status: 400,
          message: "You are not allowed to register yourself as employee",
        });
      }
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async editEmployee(req, res, next) {
    try {
      console.log("edit employee called");
      console.log({
        ...req.body,
        ...(req.file ? { image: req.file.filename } : {}),
      });
      //console.log(req.body);
      User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, ...(req.file ? { image: req.file.filename } : {}) },
        { new: true }
      )
        .then((result) => {
          return res.status(200).json({
            status: 200,
            message: "Employee updated successfully",
            data: result,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.json({
            status: 400,
            message: "Error updating employees",
            errors: error,
            data: {},
          });
        });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getTaxofBreeder(req, res, next) {
    try {
      User.findById(
        req.user.role[0] === "employee" ? req.user.breederId : req.user._id
      )
        .then((userResult) => {
          return res.status(200).json({
            status: 200,
            message: "Tax found successfully",
            data: { tax: userResult.businessInfoSettings.tax },
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error getting tax",
            errors: error,
            data: {},
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async uploadGalleryImage(req, res, next) {
    try {
      console.log("uploadGalleryImage", req.files);

      User.updateOne(
        { _id: req.user._id },
        {
          $push: {
            gallery: {
              $each: req.files.map((file) => ({
                filename: file.filename,
                size: file.size,
                addedBy: req.user._id,
                type: file.mimetype,
              })),
            },
          },
        }
      )
        .then((userResult) => {
          return res.status(200).json({
            status: 200,
            message: "User gallery uploaded successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in upload gallary image record",
            errors: err,
            data: {},
          });
        });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in upload gallary image record",
        errors: err,
        data: {},
      });
    }
  }

  async deleteGallaryImage(req, res, next) {
    try {
      // galleryImages,
      console.log("delete gallery image");
      User.findById(req.user._id).then((userData) => {
        userData.gallery = userData.gallery.filter(
          (e) => !req.body.galleryImages.includes(e._id.toString())
        );
        console.log(userData);
        userData.save().then((_) => {
          return res.status(200).json({
            status: 200,
            message: "User gallery images deleted successfully",
          });
        });
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in deleting gallary image record",
        data: {},
      });
    }
  }

  async addDealCategories(req, res, next) {
    try {
      //   console.log("uploadGalleryImage",req.files);
      User.updateOne(
        { _id: req.user._id },
        { $push: { dealCategories: { $each: req.body.dealCategories } } }
      )
        .then((userResult) => {
          return res.status(200).json({
            status: 200,
            message: "Categories added successfully",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.json({
            status: 400,
            message: "Error in adding category",
            data: {},
          });
        });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in adding category",
        data: {},
      });
    }
  }

  async deleteDealCategories(req, res, next) {
    try {
      // galleryImages,
      console.log(req.params.id);
      User.findById(req.user._id).then((userData) => {
        userData.dealCategories = userData.dealCategories.filter(
          (e) => !(req.params.id == e)
        );
        console.log(userData);
        userData.save().then((_) => {
          return res.status(200).json({
            status: 200,
            message: "User deal category deleted successfully",
          });
        });
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in deleting",
        errors: err,
        data: {},
      });
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      // console.log(req.params);
      // User.findOne({_id: req.params.id}).then(userRes => {
      //     if(!userRes) res.json({ status: 400, message: "Employee is not available", data: {} });
      //     if(userRes.role.includes('breeder')) {

      //     }
      // })
      // User.deleteOne({_id: req.params.id}).then(result => {
      //     return res.status(200).json({ status: 200, message: "Employee deleted successfully"});
      // }).catch(error => {
      //     return res.json({ status: 400, message: "Error deleting employees", errors: error, data: {} });
      // });
      User.updateOne(
        { _id: req.params.id },
        { $set: { isEmployeeActive: false } }
      )
        .then((updatedUser) => {
          console.log(updatedUser);
          return res
            .status(200)
            .send({ status: 200, message: "Employee Removed Successfully" });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ status: 400, message: "Internal Server Error" });
        });
    } catch (error) {
      return next(error);
    }
  }

  async isEmployeeEligibleForRemove(employeeId) {
    return new Promise((resolve, reject) => {
      User.findById(employeeId).then((userResult) => {
        if (!userResult) reject({ message: "Email not registered" });
      });
    });
  }

  async registerBreeder(req, res, next) {
    if (req.body.mobile) {
      req.body.mobile = randomstring.generate({
        length: 6,
        charset: "numeric",
      });
      req.body.smscode = randomstring.generate({
        length: 6,
        charset: "numeric",
      });
    }
    // console.log(req.files,"<----")
    // return res.send({message:"success",status:200})

    // superagent.post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    // // .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/automations/emails/' + listUniqueId + '/queue')
    // .set('Content-Type', 'application/json;charset=utf-8')
    // .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
    // .send({
    //   'email_address': 'talha@livewirelabs.co',
    //   'status': 'subscribed',
    //   'merge_fields': {
    //     'FNAME': "talha",'LNAME': "livewirelabs",'ARCHIVE': 'namdedTest',
    //   }
    // })
    //     .end(function(err, response) {
    //       console.log( response.body)
    //       if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
    //         res.send({message:'Signed Up!'});
    //       } else {
    //         res.send({message:'Sign Up Failed :('});
    //       }
    //   });
    //   return

    try {
      console.log("register called");
      const { errors, isValid } = validateRegisterInputBreeder(req.body);
      console.log(errors);
      console.log(isValid);
      // Check validation
      if (!isValid) {
        return res.json({
          status: 400,
          message: "errors present",
          errors: errors,
          data: {},
        });
      }
      // if (req.body.role == "employee") {
      //   }
      //   else {
      //     const { errors, isValid } = validateRegisterInput(req.body);
      //     // Check validation
      //     if (!isValid) {
      //       return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      //     }
      //   }

      // check is breeder available and email registered or admin email
      // user.findByEmailAndRoleNotAdmin(req.body.email, 'breeder', )

      User.findOne({ email: req.body.email, role: "breeder" }).then(
        async (resultUser) => {
          console.log(resultUser + " user");
          if (!resultUser) {
            // Register user...
            req.body.uid = randomstring.generate({
              length: 8,
              charset: "numeric",
            });
            try {
              req.body.stripeCustomer = await payment.createCustomer(
                req.body.name,
                req.body.email,
                "Breeder for logly platform"
              );
            } catch (err) {
              console.log(err);
            }
            this.registerUserWithRole(
              req.body,
              "breeder",
              req.body.verified ? false : true,
              req.files ? req.files : []
            )
              .then((success) => {
                console.log("success result ===> ");
                console.log(success);

                subscriberController
                  .initialSubscribeBreeder(success.data._id, req.body)
                  .then((resultSubscriber) => {
                    User.updateOne(
                      { _id: success.data._id },
                      {
                        activeSubscription: resultSubscriber._id,
                        ...(req.files && {
                          $push: {
                            documents: {
                              $each: req.files.map((file) => ({
                                filename: file.filename,
                                size: file.size,
                                type: file.mimetype,
                              })),
                            },
                          },
                        }),
                      }
                    ).then(async (userSuccess) => {
                      // Send Notification to admin..
                      User.findOne({ isAdmin: true }).then((reusltAdmin) => {
                        const notifData = {
                          token: reusltAdmin.deviceToken,
                          title: "Breeder Registered!",
                          description: "Breeder has beeen registered.",
                          data: {},
                          userId: reusltAdmin.userId,
                          notificationType: "admin",
                          type: "adminnotification",
                          breederId: success.data._id,
                        };
                        notificationController.create(notifData, true);
                      });
                      return res.status(200).send(success);
                    });
                  });

                // Send email to breeder..
                // Email is pending for later use..
                // const html = registeremail(doc.secretToken, config.Server, 'breeder');
                // mailer.sendEmail(config.mailthrough, req.body.email, 'Please verify your email!', html);
              })
              .catch((error) => {
                console.log(error);
                return res.json({
                  status: 400,
                  message: "Something wents wrong",
                });
              });
          } else if (resultUser.role.includes("admin")) {
            return res.json({ status: 400, message: "Wrorng Email" });
          } else if (resultUser.role.includes("breeder")) {
            return res.json({
              status: 400,
              message: "Email is already registered as breeder",
            });
          }
        }
      );

      // console.log(req.body);
      // const user = new User(req.body);
      // user.secretToken = randomstring.generate();
      // user.save((err, doc) => {
      //     console.log(err);
      //     if (err) return res.json({ status: 400, message: "Email is already registered", errors: err, data: {} });

      //     console.log(doc);
      //     // Initialize the forms that available to breeder ..
      //     //formController.cloneFormToBreeder(doc._id);

      //     // Send email to breeder..
      //     // Email is pending for later use..
      //      const html = registeremail(doc.secretToken, config.Server, 'breeder');
      //      mailer.sendEmail(config.mailthrough, doc.email, 'Please verify your email!', html);
      //     return res.status(200).json({ status: 200, message: "Verification email is send", data: doc });
      // });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async resendEmailBreeder(req, res, next) {
    try {
      User.findById(req.params.id).then((response) => {
        if (!response)
          return res.json({
            status: 400,
            message: "Email field is required",
            data: {},
          });

        const html = registeremail(
          response.secretToken,
          config.webServer,
          "",
          response.uid
        );
        mailer
          .sendEmail(
            config.mailthrough,
            response.email,
            "Email for logly Breeder",
            html
          )
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Email field is required",
              error,
            });
          });
        return res.json({
          status: 200,
          message: "Verification email resend successfully",
        });
      });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Email field is required",
        data: {},
      });
    }
  }

  async testSendMail(req, res, next) {
    // const html = registeremail("token", config.Server, "breeder");
    // mailer.sendEmail(
    //   config.mailthrough,
    //   "khatribilal5@gmail.com",
    //   "Please verify your email!",
    //   html
    // );
    // console.log("sending email");

    User.findOne({ isAdmin: true }).then((reusltAdmin) => {
      const notifData = {
        token: reusltAdmin.deviceToken,
        title: "Breeder Registered!",
        description: "Breeder has beeen registered.",
        data: {},
        userId: "12312312312312312312312312",
        notificationType: "admin",
        type: "adminnotification",
        breederId: "12312312313",
      };
      console.log(notifData);
      notificationController.create(notifData, true);
    });
    res.status(200).json({ status: 200, message: "email is send" });
  }

  // Not in use..
  async modifyUserWithRole(email, data, role) {
    return new Promise((resolve, reject) => {
      User.updateOne({ email }, { $set: { ...data }, $push: { role } })
        .then((updatedUser) => {
          console.log(updatedUser);
          return resolve({ status: 200, message: "Registered Successfully" });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  async forgotPassword(req, res, next) {
    try {
      if (!req.body.email) {
        return res.json({
          status: 400,
          message: "Email field is required",
          data: {},
        });
      }
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res.json({
            status: 400,
            message: "Email does not exist",
            data: {},
          });
        }
        //check for active user
        if (user.active == 0)
          return res.json({
            status: 400,
            message: "Kindly verify your account first",
            data: user,
          });
        //
        const token = randomstring.generate();
        user.resetToken = token;
        user.mobile = Math.floor(Math.random() * 90000) + 100000;
        //user.resetToken_expires=Date.now();
        user.save();
        //email send
        let html = forgetpasswordemail(
          req.body.email,
          config.webServer,
          token,
          user.mobile
        );
        mailer.sendEmail(
          config.mailthrough,
          req.body.email,
          "Password reset instructions",
          html
        );
        res.status(200).json({
          status: 200,
          message: "email is send to recover password",
          data: { id: user._id, resettoken: user.resetToken },
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async forgetpasswordphone(req, res, next) {
    try {
      if (!req.body.phone) {
        return res.json({
          status: 400,
          message: "Phone field is required",
          data: {},
        });
      }

      User.findOne({ phone: req.body.phone, role: "breeder" }).then((user) => {
        if (!user) {
          return res.json({
            status: 400,
            message: "User not found",
            data: {},
          });
        }
        //check for active user
        if (user.active == 0)
          return res.json({
            status: 400,
            message: "Kindly verify your account first",
            data: user,
          });
        //
        const token = randomstring.generate();
        user.resetToken = token;
        user.mobile = randomstring.generate({ length: 6, charset: "numeric" });
        user.save();
        //sms send
        this.sendSmsHelper(
          req.body.phone,
          process.env.TWILIO_FORGET_MSG + user.mobile
        )
          .then((send) => {
            return res.status(200).json({
              status: 200,
              message: "sms is send to recover password",
              data: { id: user._id, resettoken: user.resetToken },
            });
          })
          .catch((err) => {
            return res.json({
              status: 400,
              message: err.message,
              data: {},
              error: err,
            });
          });
      });
    } catch (error) {
      return next(error);
    }
  }

  async phonevalid(req, res, next) {
    try {
      if (!req.body.phone) {
        return res.json({
          status: 400,
          message: "Phone field is required",
          data: {},
        });
      }
      return client.lookups.v1
        .phoneNumbers(req.body.phone)
        .fetch()
        .then((phone_number) => {
          res.json({
            status: 400,
            message: "Phone number is valid",
            data: { phone_number },
          });
        })
        .catch((err) => {
          res.json({
            status: 400,
            message: "Invalid phone number",
            data: {},
            error: err,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async isForgotTokenActive(req, res, next) {
    try {
      if (!req.query.token)
        return res
          .status(400)
          .json({ status: 400, message: "Token is required", data: {} });

      User.findOne({ resetToken: removeQuote(req.query.token) }).then(
        (resToken) => {
          if (!resToken)
            return res
              .status(400)
              .json({ status: 400, message: "Invalid token", data: {} });
          return res.status(200).json({
            status: 200,
            message: "Token found successfully",
            data: { token: removeQuote(req.query.token) },
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  async resetForgotPassword(req, res, next) {
    try {
      const { errors, isValid } = validateResetPassword(req.body);
      if (!isValid)
        return res.json({
          status: 400,
          message: "Error presents",
          errors: errors,
          data: {},
        });
      const { password } = req.body;
      const { token } = req.params;
      User.findOne({ resetToken: token }).then((user) => {
        if (!user)
          return res.json({ status: 400, message: "Invalid token", data: {} });
        user.password = password;
        user.resetToken = "";
        user.save().then((resultSaved) => {
          res.status(200).json({
            status: 200,
            message: "Password changed successfully",
            data: { token, password },
          });
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      console.log("user detail by id");
      const resultUser = await User.find({ _id: req.params.id });
      if (resultUser == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      const busDetails = await BusinessDetail.findOne({
        breederId: req.params.id,
      })
        .populate("BusinessDetail._id")
        .exec();

      console.log("busDetails", busDetails);

      return res.status(200).json({
        status: 200,
        message: "User by Id",
        data: resultUser,
        busDetails,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateDeviceToken(req, res, next) {
    try {
      console.log(req.body);
      console.log(req.user._id);

      const u = await User.find({ _id: req.user._id }).lean();
      User.updateOne({ _id: req.user._id }, { $set: req.body })
        .then((resultUser) => {
          console.log("user reulst", resultUser);
          return res.send({
            status: 200,
            message: "User updated successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: error.message ? error.message : "Internal Server Error",
            data: {},
            error,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async getUserDetail(req, res, next) {
    let b, businessDetails;
    try {
      const result = await User.findById(req.user._id)
        .populate("dealCategories")
        .lean();
      const busDetails = await BusinessDetail.findOne({
        breederId: req.user._id,
      })
        .populate("BusinessDetail._id")
        .exec();
      console.log("business Details", busDetails);
      if (busDetails) {
        console.log("business details not null");
        b = { ...busDetails["_doc"] };
      }

      return res.status(200).send({
        status: 200,
        data: {
          ...result,
          businessDetails: busDetails ? b : {},
          // {
          // ...busDetails["_doc"],

          // businessInfo: businessInfo ? desc : {},
          // },
        },
        // data: {
        //   ...resultUser.toObject(),
        //   coverImage: resultUser.toObject().coverImage
        //     ? `${config.baseImageURL}${resultUser.toObject().coverImage}`
        //     : null,
        //   image: resultUser.toObject().image
        //     ? `${config.baseImageURL}${resultUser.toObject().image}`
        //     : null,
        //   gallery:
        //     resultUser.gallery && resultUser.gallery[0]
        //       ? resultUser.toObject().gallery.map((e) => ({
        //           ...e,
        //           ...{ filename: `${config.baseImageURL}${e.filename}` },
        //         }))
        //       : [],
        //   // businessDetails: {
        //   //   ...busDetails["_doc"],
        //   //   businessInfo: businessInfo ? desc : {},
        //   // },
        // },
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { type } = req.query;
      if (type === "card") {
        console.log(req.body);
        console.log(req.user._id);

        User.updateOne(
          { _id: req.user._id },
          { $push: { creditCard: req.body } }
        )
          .then((resultUser) => {
            console.log(resultUser);
            console.log("user reulst");
            return res.send({
              status: 200,
              message: "Card updated successfully",
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: error.message ? error.message : "Internal Server Error",
              data: {},
              error,
            });
          });
      } else {
        console.log(req.body);
        console.log(req.user._id);

        const u = await User.find({ _id: req.user._id }).lean();
        let bussId = u[0].businessId;
        console.log(bussId);

        const uupdateBus = await BusinessDetail.updateOne(
          {
            _id: bussId,
          },
          { businessInfo: req.body.description }
        );
        console.log("update", updateBus);
        User.updateOne({ _id: req.user._id }, { $set: req.body })
          .then((resultUser) => {
            console.log("user reulst", resultUser);
            return res.send({
              status: 200,
              message: "User updated successfully",
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: error.message ? error.message : "Internal Server Error",
              data: {},
              error,
            });
          });
      }
    } catch (error) {
      return next(error);
    }
  }

  async updateImage(req, res, next) {
    try {
      User.updateOne(
        { _id: req.user._id },
        { $set: { [req.body.name]: req.file.filename } }
      )
        .then((resultUser) => {
          return res.send({
            status: 200,
            message: "Image updated successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: error.message ? error.message : "Internal Server Error",
            data: {},
            error,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async updateImage2(req, res, next) {
    try {
      User.updateOne(
        { _id: req.user._id },
        { $set: { [req.body.name]: req.file.filename } }
      )
        .then((resultUser) => {
          console.log("result image", req.file.path);
          return res.send({
            status: 200,
            data: {
              imageUrl: req.file.path,
            },
            message: "Image updated successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: error.message ? error.message : "Internal Server Error",
            data: {},
            error,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword() {}

  async getAllBreedersId() {
    return User.find({ role: "breeder" }).then((breederResult) =>
      breederResult.map((value) => value._id)
    );
  }

  async dashboardAnalysis(req, res, next) {
    try {
      const { _id } = req.user;
      const { type } = req.query;
      if (type === "animal") {
        Animal.aggregate([
          { $match: { breederId: _id } },
          {
            $group: {
              _id: "$breederId",
              animalSold: { $sum: "$soldQuantity" },
              aliveQuantity: { $sum: "$aliveQuantity" },
              sickQuantity: { $sum: "$sickQuantity" },
              deadQuantity: { $sum: "$deadQuantity" },
              pregnantQuantity: { $sum: "$pregnantQuantity" },
            },
          },
        ]).then((animalResult) => {
          // Sale.find({sellerId: _id})
          return res.send({
            status: 200,
            message: "Dashboard Data found successfully",
            data: { animal: animalResult },
          });
        });
      } else if (type === "product") {
        Product.aggregate([
          { $match: { breederId: _id } },
          {
            $group: {
              _id: "$breederId",
              damaged: { $sum: "$damagedQuantity" },
              expired: { $sum: "$expiredQuantity" },
              goodCondition: { $sum: "$goodConditionQuantity" },
              sold: { $sum: "$soldQuantity" },
            },
          },
        ]).then((animalResult) => {
          // Sale.find({sellerId: _id})
          return res.send({
            status: 200,
            message: "Dashboard Data found successfully",
            data: { animal: animalResult },
          });
        });
      } else {
        return res.send({
          status: 200,
          message: "Error Occured!",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async getItemsCount(req, res, next) {
    try {
      const query = req.user.isAdmin ? {} : { breederId: req.user._id };
      const getAnimalCount = Promise.resolve(
        Animal.find({ ...query, isArchived: false }).count()
      );
      const getProductCount = Promise.resolve(
        Product.find({ ...query, isArchived: false }).count()
      );
      const getEmployeesCount = Promise.resolve(
        User.find({
          ...query,
          role: "employee",
          isEmployeeActive: true,
        }).count()
      );

      Promise.all([getAnimalCount, getEmployeesCount, getProductCount])
        .then(([animalCount, employeeCount, productCount]) => {
          return res.send({
            status: 200,
            message: "Item Count found successfully",
            data: { animalCount, employeeCount, productCount },
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: error.message ? error.message : "Internal Server Error",
            data: {},
            error,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async adminDashboardStatics(req, res, next) {
    const getTotalSale = () => {
      return new Promise((resolve, reject) => {
        Sale.aggregate([
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ])
          .then((result) => resolve(result[0].total))
          .catch(reject);
      });
    };

    const getTotalAnimal = () => {
      return new Promise((resolve, reject) => {
        Animal.find({}).count().then(resolve).catch(reject);
      });
    };

    const getTotalProduct = () => {
      return new Promise((resolve, reject) => {
        Product.find({}).count().then(resolve).catch(reject);
      });
    };

    const totalBreeders = () => {
      return new Promise((resolve, reject) => {
        User.aggregate([
          {
            $match: {
              role: "breeder",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$isblocked", false] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              block: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$isblocked", true] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
        ]).then((result) => resolve(result[0]));
      });
    };

    const getAverageSale = () => {
      return new Promise((resolve, reject) => {
        Sale.aggregate([
          {
            $group: {
              _id: { $month: "$createdAt" },
              totalPrice: { $sum: "$totalPrice" },
            },
          },
        ])
          .then((result) => {
            resolve(
              result.reduce((acc, cv) => acc + cv.totalPrice, 0) / result.length
            );
          })
          .catch(reject);
      });
    };

    try {
      Promise.all([
        getTotalSale(),
        getTotalAnimal(),
        getTotalProduct(),
        getAverageSale(),
        totalBreeders(),
      ]).then(
        ([
          TotalSale,
          AnimalCount,
          ProductCount,
          AverageSale,
          TotalBreeders,
        ]) => {
          return res.send({
            status: 200,
            message: "Admin Dashboard Statics Found Successfully",
            data: {
              totalSale: TotalSale,
              animalCount: AnimalCount,
              productCount: ProductCount,
              averageSale: AverageSale,
              totalBreeders: TotalBreeders,
            },
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  async setupWizard(req, res, next) {
    try {
      const {
        selectedAnimalForms,
        selectedProductForm,
        employeeArray,
        // businessDetails,
      } = req.body;

      console.log(selectedAnimalForms);
      console.log(employeeArray);
      Promise.all([
        new Promise(async (resolve, reject) => {
          let resultForm = await Form.find({
            _id: {
              $in: [...selectedAnimalForms, ...selectedProductForm],
            },
          });
          resultForm = resultForm.map((e) => e.toObject());
          resultForm = resultForm.map((e) => ({
            ...e,
            breedersId: [...e.breedersId, ...[req.user._id]],
            formStructure: e.formStructure.map((fs) => ({
              ...fs,
              breedersId: [...fs.breedersId, ...[{ _id: req.user._id }]],
            })),
          }));

          // resultForm[0].save().then(resultComplete=> {
          //     console.log('saved [0]');
          // })

          resultForm.forEach((form) => {
            console.log("form", form);
            Form.updateOne({ _id: form._id }, form).then((resultModified) => {
              console.log("modified successfully");
            });
          });
          resolve();
        }),
        //

        // new Promise((resolve, reject) => {
        //   const {
        //     businessInfo,
        //     daysOpen,
        //     openHrStart,
        //     openHrEnd,
        //     breakTimeStart,
        //     breakTimeEnd,
        //     holidays,
        //     taxPercentage,
        //   } = businessDetails;
        //   const businessDetailvar = BusinessDetail.findOneAndUpdate(
        //     { breederId: req.user._id },
        //     {
        //       businessInfo: businessInfo,
        //       daysOpen: daysOpen,
        //       openHrStart: openHrStart,
        //       openHrEnd: openHrEnd,
        //       breakTimeStart: breakTimeStart,
        //       breakTimeEnd: breakTimeEnd,
        //       holidays: holidays,
        //       taxPercentage: taxPercentage,
        //       // breederId: req.user._id,
        //     },
        //     { upsert: true }
        //   ).then((resultModified) => {
        //     console.log("modified peacefully");
        //   });
        //   console.log("businessDetailvar", businessDetailvar);

        //   resolve();
        // }),

        //

        new Promise((resolve, reject) => {
          employeeArray.forEach((employee) => {
            employee.breederUniqueId = req.user.uid;
            employee.breederId = req.user._id;
            User.findOne({
              email: employee.email,
              role: "employee",
              breederId: req.user._id,
              isEmployeeActive: true,
            }).then((resultUser) => {
              if (!resultUser) {
                this.registerUserWithRole(employee, "employee", false).then(
                  (success) => {
                    console.log("employee added");
                  }
                );
              }
            });
          });
          resolve();
        }),
        // ]).then(([animal, product, employee, BusinessDetails]) => {
      ]).then(([animal, product, employee]) => {
        User.updateOne(
          { _id: req.user._id },
          { $set: { setupWizardCompleted: true } }
        ).then((resultComplted) => {
          return res.send({ status: 200, message: "Setup Wizard Completed!" });
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async setupWizard2(req, res, next) {
    try {
      const {
        selectedAnimalForms,
        selectedProductForm,
        employeeArray,
        businessDetails,
      } = req.body;

      const formFunction = async (selectedAnimalForms, selectedProductForm) => {
        if (selectedAnimalForms && selectedProductForm) {
          return new Promise(async (resolve, reject) => {
            let resultForm = await Form.find({
              _id: {
                $in: [...selectedAnimalForms, ...selectedProductForm],
              },
            }).lean();
            // resultForm = resultForm.map((e) => e.toObject());
            resultForm = resultForm.map((e) => ({
              ...e,
              breedersId: [...e.breedersId, ...[req.user._id]],
              formStructure: e.formStructure.map((fs) => ({
                ...fs,
                breedersId: [...fs.breedersId, ...[{ _id: req.user._id }]],
              })),
            }));

            resultForm.forEach((form) => {
              console.log("form", form);
              Form.updateOne({ _id: form._id }, form).then((resultModified) => {
                // console.log("modified successfully");
              });
            });

            // return "done";

            resolve();
          });
        } else {
          return [];
        }
      };

      const employeeFunc = (employeeArray) => {
        if (employeeArray) {
          console.log("employee ", employeeArray);
          return new Promise((resolve, reject) => {
            employeeArray.forEach((employee) => {
              employee.breederUniqueId = req.user.uid;
              employee.breederId = req.user._id;
              User.findOne({
                email: employee.email,
                role: "employee",
                breederId: req.user._id,
                isEmployeeActive: true,
              }).then((resultUser) => {
                if (!resultUser) {
                  this.registerUserWithRole(employee, "employee", false).then(
                    (success) => {
                      console.log("employee added");
                    }
                  );
                }
              });
            });

            resolve();
          });
        } else {
          return new Promise((resolve, reject) => {
            resolve();
          });
        }
      };

      const businessFunc = async (businessDetails) => {
        if (businessDetails) {
          return new Promise(async (resolve, reject) => {
            const {
              businessInfo,
              imageUrl,
              daysOpen,
              openHrStart,
              openHrEnd,
              breakTimeStart,
              breakTimeEnd,
              holidays,
              taxPercentage,
            } = businessDetails;
            const businessDetailvar = await BusinessDetail.findOneAndUpdate(
              { breederId: req.user._id },
              {
                businessInfo: businessInfo,
                imageUrl: imageUrl,
                daysOpen: daysOpen,
                openHrStart: openHrStart,
                openHrEnd: openHrEnd,
                breakTimeStart: breakTimeStart,
                breakTimeEnd: breakTimeEnd,
                holidays: holidays,
                taxPercentage: taxPercentage,
                // breederId: req.user._id,
              },
              { upsert: true }
            ).then((resultModified) => {
              console.log("modified peacefully", resultModified);
              updater = resultModified._id;

              resolve();
            });
            console.log(req.user._id);
            const docc = await User.findOneAndUpdate(
              { _id: req.user._id },
              { businessId: updater, setupWizardCompleted: true },
              // { $set: { setupWizardCompleted: true } },

              { upsert: true }
            );
            console.log("docc", docc);
          });
        } else {
          return [];
        }
      };

      const response1 = await formFunction(
        selectedAnimalForms,
        selectedProductForm
      );

      const response2 = await employeeFunc(employeeArray);

      const response3 = await businessFunc(businessDetails);

      return res.send({ status: 200, message: "Setup Wizard Completed!" });
    } catch (error) {
      return res.send({ status: 400, message: "Error in Setup Wizard" });
    }
  }

  async addCreditCardBusiness(req, res, next) {
    console.log(req.body, "<--addCreditCardBusiness");
    try {
      const {
        name,
        cardNumber,
        expiryDate,
        cvc,
        customerId,
        userId,
      } = req.body;
      let CVC = cvc;
      const [expiryMonth, expiryYear] = expiryDate.split(" / ");

      payment
        .createSource(
          cardNumber,
          expiryMonth.trim(),
          expiryYear.trim(),
          CVC,
          customerId
        )
        .then((response) => {
          console.log("response is :: addCreditCardBusiness");
          console.log(response);
          User.updateOne(
            { _id: userId },
            {
              $push: {
                creditCard: {
                  name: name,
                  card: response,
                  customer: customerId,
                },
              },
            }
          ).then((responseUser) => {
            return res.send({
              status: 200,
              message: "Credit Card Added Successfully!",
              result: responseUser,
            });
          });
        });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async addCreditCard(req, res, next) {
    console.log(req.body, "<---req.body");
    try {
      const { name, cardNumber, expiryDate } = req.body;
      const [expiryMonth, expiryYear] = expiryDate.split(" / ");
      const { id } = req.user.stripeCustomer;
      let CVC = req.body.CVC ? req.body.CVC : req.body.cvc;
      payment
        .createSource(
          cardNumber,
          expiryMonth.trim(),
          expiryYear.trim(),
          CVC,
          id
        )
        .then((response) => {
          console.log("response is ::");
          console.log(response);
          if (req.body.businessName && req.body.individualChange) {
            User.updateOne(
              { _id: req.user._id },
              {
                $push: {
                  creditCard: { name: name, card: response, customer: id },
                },
                businessName: req.body.businessName,
                noOfEmployees: req.body.noOfEmployees,
                website: req.body.website ? req.body.website : "",
              }
            )
              .then((responseUser) => {
                return res.send({
                  status: 200,
                  message: "Business Info Added Successfully!",
                  result: responseUser,
                });
              })
              .catch((err) => {
                return res.send({
                  status: 400,
                  message: "Error updating Business info ",
                  result: [],
                  error: err,
                });
              });
          } else {
            User.updateOne(
              { _id: req.user._id },
              {
                $push: {
                  creditCard: { name: name, card: response, customer: id },
                },
              }
            )
              .then((responseUser) => {
                return res.send({
                  status: 200,
                  message: "Credit Card Added Successfully!",
                  result: responseUser,
                });
              })
              .catch((err) => {
                return res.send({
                  status: 400,
                  message: "Error adding/updating card info ",
                  result: [],
                  error: err,
                });
              });
          }
        });
    } catch (error) {
      console.log(error, "<--error addCreditCard ");
      return next(error);
    }
  }

  async verifyByCode(req, res) {
    try {
      const { code } = req.body;
      // Find account with matching secret token
      const user = await User.findOne({ mobile: code });
      if (!user) {
        return res.json({
          status: 404,
          message: "Invalid verification code",
          data: {},
        });
      }
      user.verified = true;
      user.secretToken = "";
      user.resetToken = "";
      user.mobile = null;
      await user.save();
      return res
        .status(200)
        .json({ status: 200, message: "Account is verified", data: user });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Account verification issue",
        error: error,
        data: {},
      });
    }
  }

  async verifyBySms(req, res) {
    try {
      const { code } = req.body;
      // Find account with matching secret token
      const user = await User.findOne({ smscode: code });
      if (!user) {
        return res.json({
          status: 404,
          message: "Invalid Verification code",
          data: {},
        });
      }
      user.verified = true;
      user.secretToken = "";
      user.resetToken = "";
      user.smscode = null;
      await user.save();
      return res
        .status(200)
        .json({ status: 200, message: "Account is verified", data: user });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Account verification issue",
        error: error,
        data: {},
      });
    }
  }

  async verifySmsMobile(req, res) {
    const { mobile, smscode } = req.body;
    if (!mobile || !smscode) {
      return res.json({
        status: 400,
        message: "Kindly provide all required data",
        data: {},
      });
    }
    try {
      // Find account with matching secret token
      const user = await User.findOne({ smscode, mobile });
      if (!user) {
        return res.json({
          status: 404,
          message: "Invalid email or phone code!",
          data: {},
        });
      }
      user.verified = true;
      user.secretToken = "";
      user.resetToken = "";
      user.smscode = null;
      user.mobile = null;
      await user.save();
      return res
        .status(200)
        .json({ status: 200, message: "Account is verified", data: user });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Account verification issue",
        error: error,
        data: {},
      });
    }
  }

  async verifyByCodePassword(req, res) {
    try {
      const { code } = req.body;
      const user = await User.findOne({ mobile: code });
      if (!user) {
        return res.json({ status: 404, message: "Invalid code", data: {} });
      }
      await user.save();
      return res
        .status(200)
        .json({ status: 200, message: "Valid code", data: user });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Issue in verification",
        error: error,
        data: {},
      });
    }
  }

  async resetForgetPasswordByCode(req, res, next) {
    try {
      const { errors, isValid } = validateResetPassword(req.body);
      if (!isValid)
        return res.json({
          status: 400,
          message: "Error presents",
          errors: errors,
          data: {},
        });
      const { password, code } = req.body;
      User.findOne({ mobile: code }).then((user) => {
        if (!user)
          return res.json({
            status: 400,
            message: "Invalid verification code",
            data: {},
          });
        user.password = password;
        user.resetToken = "";
        user.mobile = null;
        user.save().then((resultSaved) => {
          res.status(200).json({
            status: 200,
            message: "Password changed successfully",
            data: resultSaved,
          });
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async resendCodeVerification(req, res, next) {
    try {
      if (!req.body.email) {
        return res.json({
          status: 400,
          message: "Email field is required",
          data: {},
        });
      }
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res.json({
            status: 400,
            message: "Email does not exist",
            data: {},
          });
        }

        user.mobile = Math.floor(Math.random() * 90000) + 100000;
        user.save();
        //email send
        let html = resendVerification(req.body.email, user.mobile);
        mailer.sendEmail(
          config.mailthrough,
          req.body.email,
          "Verification code",
          html
        );
        res.status(200).json({
          status: 200,
          message: "Verification code is send",
          data: { id: user._id, resettoken: user.resetToken },
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async resendCodeVerificationSms(req, res, next) {
    try {
      if (!req.body.phone) {
        return res.json({
          status: 400,
          message: "Phone field is required",
          data: {},
        });
      }
      User.findOne({ phone: req.body.phone, role: "breeder" }).then((user) => {
        if (!user) {
          return res.json({
            status: 400,
            message: "Phone does not exist",
            data: {},
          });
        }

        user.smscode = Math.floor(Math.random() * 90000) + 100000;
        user.save();
        //sms send
        this.sendSmsHelper(
          req.body.phone,
          process.env.TWILIO_REGISTRATION_MSG + user.smscode
        )
          .then((send) => {
            return res.status(200).json({
              status: 200,
              message: "Verification code send successfully",
              data: { id: user._id, resettoken: user.resetToken },
            });
          })
          .catch((err) => {
            return res.json({
              status: 400,
              message: err.message,
              data: {},
              error: err,
            });
          });
      });
    } catch (error) {
      return next(error);
    }
  }

  async resendVerificationCodes(req, res, next) {
    try {
      if (!req.body.email) {
        return res.json({
          status: 400,
          message: "Email field is required",
          data: {},
        });
      }
      User.findOne({ email: req.body.email, role: "breeder" }).then((user) => {
        if (!user) {
          return res.json({
            status: 400,
            message: "Email does not exist",
            data: {},
          });
        }

        user.mobile = randomstring.generate({ length: 6, charset: "numeric" });
        user.smscode = randomstring.generate({ length: 6, charset: "numeric" });
        user.save();
        //send sms
        this.sendSmsHelper(
          user.phone,
          process.env.TWILIO_REGISTRATION_MSG + user.smscode
        )
          .then((send) => console.log("registration sms send", send))
          .catch((err) => console.log("registration sms error", err));
        //email send
        let html = resendVerification(req.body.email, user.mobile);
        mailer.sendEmail(
          config.mailthrough,
          req.body.email,
          "Verification code",
          html
        );
        res.status(200).json({
          status: 200,
          message: "Verification codes send successfully",
          data: { id: user._id, resettoken: user.resetToken },
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async deviceToken(req, res, next) {
    // console.log("req: ", req);
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;

    try {
      const result = await User.findById(req.user._id);
      let token;
      if (result.deviceToken) {
        token = result.deviceToken;
      }
      console.log("token", token);
      return res.status(200).json({
        status: 200,
        message: "device",
        data: { deviceToken: token },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getUserEmail(req, res, next) {
    console.log("req", req);
    let emailId;
    let _id, name, email, phone, state, city, address, image;

    try {
      console.log(req.user.email);

      if (req.user.email === req.query.email) {
        return res.status(200).json({
          status: 400,
          message: "your Email is not required",
        });
      } else {
        emailId = await User.find({ email: req.query.email }).lean();
        _id = emailId[0]._id;
        name = emailId[0].name;
        email = emailId[0].email;
        phone = emailId[0].phone;
        state = emailId[0].state;
        city = emailId[0].city;
        address = emailId[0].address;
        image = emailId[0].image;
      }
      return res.status(200).json({
        status: 200,
        message: "Email Found",
        data: {
          _id,
          name: name,
          email,
          phone,
          state,
          city,
          image,
          address,
        },
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Email not found",
        errors: err,
        data: {},
      });
    }
  }

  // async getUserByEmail(req, res, next) {
  //   console.log("req", req);
  //   let emailId;
  //   let name, email, phone, state, city, address, image;

  //   try {
  //     console.log(req.user.email);

  //     if (req.user.email === req.query.email) {
  //       return res.status(200).json({
  //         status: 400,
  //         message: "your Email is not required",
  //       });
  //     } else {
  //       emailId = await User.find({ email: req.query.email }).lean();
  //       name = emailId[0].name;
  //       email = emailId[0].email;
  //       phone = emailId[0].phone;
  //       state = emailId[0].state;
  //       city = emailId[0].city;
  //       address = emailId[0].address;
  //       image = emailId[0].image;
  //     }
  //     return res.status(200).json({
  //       status: 200,
  //       message: "Email Found",
  //       data: {
  //         name: name,
  //         email,
  //         phone,
  //         state,
  //         city,
  //         image,
  //         address,
  //       },
  //     });
  //   } catch (err) {
  //     return res.json({
  //       status: 400,
  //       message: "Email not found",
  //       errors: err,
  //       data: {},
  //     });
  //   }
  // }

  async getMatchingEmails(req, res, next) {
    try {
      if (!req.body.email) {
        return res.json({
          status: 400,
          message: "Email field is required",
          data: {},
        });
      }
      User.find({ email: req.body.email }).then((user) => {
        if (user.length === 0) {
          return res.json({
            status: 400,
            message: "Email does not exist",
            data: {},
          });
        }
        res.status(200).json({
          status: 200,
          message: "All matching email",
          data: user,
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async updatePackageMobile(req, res, next) {
    try {
      if (
        !req.body.userId ||
        !req.body.packageType ||
        !req.body.packageId ||
        !req.body.type
      ) {
        return res.json({
          status: 400,
          message: "Kindly provide all required data",
          data: {},
        });
      }
      subscriberController
        .initialSubscribeBreeder(req.body.userId, req.body)
        .then((resultSubscriber) => {
          res.status(200).json({
            status: 200,
            message: "Package has been subscribed successfully",
            data: resultSubscriber,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async sendSms(req, res, next) {
    const { phone } = req.body;
    try {
      if (!phone) {
        return res.json({
          status: 400,
          message: "Kindly provide all required data",
          data: {},
        });
      }
      this.sendSmsHelper(phone, "message")
        .then((result) => {
          console.log(result);
          res.status(200).json({
            status: 200,
            message: "Sms send success",
            data: result,
          });
        })
        .catch((err) => {
          return next(err);
        });
    } catch (error) {
      console.log(error, "<--error");
      return next(error);
    }
  }

  async sendSmsHelper(phone, message) {
    return new Promise((resolve, reject) => {
      client.messages
        .create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: phone,
        })
        .then((message) => {
          console.log(message, "error sendSmsHelper");
          resolve(message);
        })
        .catch((error) => {
          console.log(error, "error sendSmsHelper");
          reject(error);
        });
    });
  }
}
module.exports = new UserController();
