const { User } = require("../models/User");
const { validateLoginInput, validateRegisterInput, validateRegisterInputEmp, validateRegisterInputBreeder, validateResetPassword } = require("../validation/users");
const mailer = require('../misc/mailer');
const randomstring = require('randomstring');
const { Animal } = require("../models/Animal/Animal");
const { Form } = require("../models/Form/Form");
const { Sale } = require('../models/Sales');


const config = require("../config/key");
const registeremail = require('../emails/register');
const employeeEmail = require('../emails/employeeRegister');

const forgetpasswordemail = require('../emails/forgetpassword');
// const formController = require("./form.controller");
const {removeQuote} = require('../middleware/constant');
const { Types } = require("mongoose");
const notificationController = require("./notification.controller");
const salesController = require("./sales.controller");
const { reject } = require("async");

class UserController {
    constructor() { 
        // this.registerUserWithRole = this.registerUserWithRole.bind(this);
        this.registerBreeder = this.registerBreeder.bind(this);
        this.registerEmployees = this.registerEmployees.bind(this);
        this.setupWizard = this.setupWizard.bind(this);
    }




    
    authentication(req, res, next) {
        try {
            return res.status(200).json({
                status: 200, message: "auth user success", isAuth: true,
                isAdmin: req.user.role === "admin" ? true : false,
                data: {
                    _id: req.user._id,
                    email: req.user.email,
                    name: req.user.name,

                    setupWizardCompleted: req.user.setupWizardCompleted,
                    notificationSettings : req.user.notificationSettings
                }
            });
        } catch (err) {
            return next(err);
        }
    }


    async getAllEmployeesOfBreeder(breederId) {
        return new Promise((resolve, reject)=> {
            User.find({breederId, role: 'employee'}).then(allEmployees => {
                resolve(allEmployees);
            }).catch(error => {
                reject(error);
            })
        }); 
    }

    async employeeLogin(req, res, next) {
        try {
            const { errors, isValid } = validateLoginInput(req.body);
            //console.log(req.body);
            // Check validation
            if (!isValid) {
              return res.json({ status: 400, message: "Please fill all the required fields", errors: errors, data: {} });
            }
            User.findOne({ email: req.body.email, role: req.body.role }, (err, user) => {
              if (!user)
                return res.json({
                  status: 400, message: "Please enter your valid email", data: {}
                })
                
            User.findOne({_id:user.breederId,uid:req.body.uid}, (err, breeder) => {
                    if (!breeder)
                    return res.json({
                      status: 400, message: "Please enter your valid breeder id", data: {}
                    })

              user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                  return res.json({ status: 400, message: "Incorrect password", errors: errors, data: {} });
          
                user.generateToken((err, user) => {
                  if (err) return res.send(err);
                  //io.emit("userSet", { msg: "email is registered", email: req.body.email });
          
                 
                  return res.status(200)
                    .json({
                      status: 200, message: "Login successfully", data: { userId: user._id, token: user.token, email: user.email }
                    });
                });
              });
            });
            });
        } catch(err) {
            return next(err);
        }
    }

    async isblocked(req, res) {
        if (!req.body.isblocked) {
            return res.json({ status: 400, message: "isblocked field is required", errors: { file: "isblocked field is required" }, data: {} })
        }
        try {
            const user = await User.updateMany({ $or: [{ _id: req.params.id }, { breederId: req.params.id }] }, req.body);
            return res.status(200).json({ status: 200, message: "Breeder and all its emp blocked successfully", data: user });
        } catch (err) {
            return res.json({ status: 400, message: "Error in blocking Breeder and all its emp", errors: err, data: {} });
        }
    }


    async getAllEmployees(req, res) {
        try {
            User.find({ ...{ role: 'employee' }, ...req.user.isAdmin ? {} : { breederId: req.user._id } }).then(result => {
                return res.status(200).json({ status: 200, message: "Employee found successfully", data: result.map(e => ({...e.toObject(), ...{image:  e.toObject().image ? `${config.baseImageURL}${e.toObject().image}`: null}})) });
            }).catch(error => {
                return res.json({ status: 400, message: "Error fetching employees", errors: error, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }



    async getBreederForSales(req, res) {
        try {
            const keyword = req.query.keyword.replace(/['"]+/g, '');
            if(!keyword) { 
                salesController.getBreederSalesList(req.user._id).then(resultSales => {
                    User.find({role: 'breeder', _id: {$in: resultSales}}).then(result => {
                        return res.status(200).json({ status: 200, message: "Breeder found successfully", data: result.map(e => ({...e.toObject(), ...{image:  e.toObject().image ? `${config.baseImageURL}${e.toObject().image}`: null}})) });
                    }).catch(error => {
                        return res.json({ status: 400, message: "Error fetching breeder", errors: error, data: {} });
                    });
                });
            } else {
                User.find({role: 'breeder', $or: [{name: { $regex: keyword, $options: 'i'}}, {email: { $regex: keyword, $options: 'i'}}, {city: { $regex: keyword, $options: 'i'}}, {state: { $regex: keyword, $options: 'i'}}, {phone: { $regex: keyword, $options: 'i'}}] }).then(result => {
                    return res.status(200).json({ status: 200, message: "Breeder found successfully", data: result.map(e => ({...e.toObject(), ...{image:  e.toObject().image ? `${config.baseImageURL}${e.toObject().image}`: null}})) });
                }).catch(error => {
                    return res.json({ status: 400, message: "Error fetching breeder", errors: error, data: {} });
                });
            }
           
           
        } catch (err) {
            return next(err);
        }
    }


    async getEmployeeById(req, res, next) {
        console.log("called",req.params.id)
        try {
            // User.findOne({ role: 'employee', _id: req.params.id }).then(result => {
            //     return res.status(200).json({ status: 200, message: "Employee found successfully", data: {...result.toObject(), ...{image:  result.toObject().image ? `${config.baseImageURL}${result.toObject().image}`: null}}});
            // }).catch(error => {
            //     return res.json({ status: 400, message: "Error fetching employees", errors: error, data: {} });
            // });
            User.aggregate([ {$match: { role: 'employee', _id:  Types.ObjectId(req.params.id) }}, {$lookup: {
                from: 'animals',
                localField: "breederId",
                foreignField: "breederId",
                as: "animalData"
            }}]).exec().then(result => {
                console.log(result);
                return res.status(200).json({ status: 200, message: "Employee found successfully", data: {...result[0], ...{image:  result[0].image ? `${config.baseImageURL}${result[0].image}`: null}}});
            }).catch(error => {
                console.log(error);
                return res.json({ status: 400, message: "Error fetching employees", errors: error, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }



    async getEmployeeByBreeder(req, res, next) {
        console.log('breeder employee called');
        console.log(req.user._id);
        try {
            User.find({ role: 'employee', breederId: req.user._id, isEmployeeActive: true, }).sort({ createdAt: -1 }).then(result => {
                console.log(result);
                return res.status(200).json({ status: 200, message: "Employee found successfully", data: result.map(e => ({...e.toObject(), ...{image:  e.toObject().image ? `${config.baseImageURL}${e.toObject().image}`: null}})) });
            }).catch(error => {
                return res.json({ status: 400, message: "Error fetching employees", errors: error, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }

   
    async changePasswordEmp(req, res, next) {
        console.log('changePasswordEmp employee',req.body);
        console.log(req.user._id);
        try {
            User.findById(req.user._id).then(result => {
                if(result){
                     result.comparePassword(req.body.password, (err, isMatch) => {
                        if (!isMatch){
                          return res.json({ status: 400, message: "Existing password is incorrect", data: {} })
                        }
                        else{
                            result.password = req.body.changePassword;
                            result.save().then(resultSaved => {
                                res.status(200).json({ status: 200, message: "Password changed successfully", data: {  } });
                            });
                        }
                })}
                else{
                return res.status(200).json({ status: 200, message: "Employee not found", data:{} });
                }
            }).catch(error => {
                return res.json({ status: 400, message: "Error in Password Changed", errors: error, data: {} });
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


    async registerEmployees(req, res, next) {
        try {
            const { errors, isValid } = validateRegisterInputEmp(req.body);
            // Check validation
            if (!isValid) {
                return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
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


            // Check is employee, isadmin and email is exist.. Manually
            // user.findByEmailAndRoleNotAdmin(req.body.email, req.bodly.role, ())
            // if email exist then add role

            // if email donot exist then create user.
            console.log('Inside register employeeee');
            console.log(req.body.email===req.user.email);
            if(!(req.body.email===req.user.email)) {
                User.findOne({email: req.body.email, role: 'employee', breederId: req.user._id, isEmployeeActive: true }).then(resultUser => {
                    console.log(resultUser + ' user');
                    if(!resultUser) {
                        req.body.breederUniqueId = req.user.uid;
                        // Register user... 
                        req.body.breederId = req.user._id;
    
                        req.body.image = req.file ? req.file.filename : null;
                        this.registerUserWithRole(req.body, 'employee', false).then(success => {
                            console.log(success);
                            notificationController.create(req.user._id, 'mynotification',  'employee', 'Employee Registered Successfully', 'You have registered a new employee', req.user._id, null, success.data._id, req.user.deviceToken, true).then(resultNotifCreate => {
                                console.log(resultNotifCreate);
                            })
                            return res.status(200).send({status: 200, message: 'Employee Registered Successfully', data: success});
                        }).catch(error => {
                            console.log(error);
                            return res.json({ status: 400, message: "Something wents wrong" });
                        })
                    } else {
                        return res.status(200).json({ status: 400, message: "Employee is already registered" });
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
            } else  {
                return res.status(200).json({ status: 400, message: "You are not allowed to register yourself as employee" });
            }
         
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }


    async editEmployee(req, res, next) {
        try {
            console.log('edit employee called');
            console.log(req.body);
            User.findByIdAndUpdate(req.params.id, {...req.body, ...req.file ? {image: req.file.filename} : {}} , { new: true }).then(result => {
                return res.status(200).json({ status: 200, message: "Employee updated successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error updating employees", errors: error, data: {} });
            });
        } catch (error) {
            return next(error);
        }
    }

    async getTaxofBreeder(req, res, next) {
        try {
            User.findById(req.user.role[0] === 'employee'  ? req.user.breederId :  req.user._id).then(userResult => {
                return res.status(200).json({ status: 200, message: "Tax found successfully", data: {tax: userResult.businessInfoSettings.tax} });
            }).catch((error) => {
                return res.json({ status: 400, message: "Error getting tax", errors: error, data: {} });
            })
        } catch(error) {
            return next(error);
        }
    }



    async uploadGalleryImage(req, res, next) {
        try {
          console.log("uploadGalleryImage",req.files);
    
          User.updateOne({_id: req.user._id}, {$push: {gallery: {$each: req.files.map(file => ({filename: file.filename, size: file.size}))} }}).then(userResult => {
            return res.status(200).json({
              status: 200,
              message: "User gallery uploaded successfully",
            });
          }).catch(error => {
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
    
      async deleteGallaryImage(req, res,next) {
        try {
          // galleryImages, 
          console.log('delete gallery image');
          User.findById(req.user._id).then(userData => {
            userData.gallery = userData.gallery.filter(e => !req.body.galleryImages.includes(e._id.toString()));
            console.log(userData);
            userData.save().then(_ => {
              return res.status(200).json({
                status: 200,
                message: "User gallery images deleted successfully",
              });
            });
          })
        } catch(error) {
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
          User.updateOne({_id: req.user._id}, {$push: {dealCategories: {$each: req.body.dealCategories} }}).then(userResult => {
            return res.status(200).json({
              status: 200,
              message: "Categories added successfully",
            });
          }).catch(error => {
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


      async deleteDealCategories(req, res,next) {
        try {
          // galleryImages, 
          console.log(req.params.id);
          User.findById(req.user._id).then(userData => {
            userData.dealCategories = userData.dealCategories.filter(e => !(req.params.id==e));
            console.log(userData);
            userData.save().then(_ => {
              return res.status(200).json({
                status: 200,
                message: "User deal category deleted successfully",
              });
            });
          })
        } catch(error) {
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
            User.updateOne({_id: req.params.id}, {$set: {isEmployeeActive: false}}).then(updatedUser => {
                console.log(updatedUser);
                return res.status(200).send({status: 200, message: "Employee Removed Successfully"});
            }).catch(error => {
                return res.status(400).json({status: 400, message: "Internal Server Error"});
            })
        } catch (error) {
            return next(error);
        }
    }


    async isEmployeeEligibleForRemove(employeeId) {
        return new Promise((resolve, reject) => {
            User.findById(employeeId).then(userResult => {
                if(!userResult) reject({message: 'Email not registered'});
            });
        }); 
    }

    async registerBreeder(req, res, next) {
        try {
            console.log("register called")
            const { errors, isValid } = validateRegisterInputBreeder(req.body);
            console.log(errors);
            console.log(isValid);
            // Check validation
            if (!isValid) {
                return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
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

            User.findOne({email: req.body.email, role: 'breeder'}).then(resultUser => {
                console.log(resultUser + ' user');
                if(!resultUser) { 
                    // Register user... 
                    req.body.uid = randomstring.generate({length: 8, charset: 'numeric'});

                    this.registerUserWithRole(req.body, 'breeder', true).then(success => {
                        console.log(success);


                        // Send email to breeder..
                        // Email is pending for later use.. 
                        // const html = registeremail(doc.secretToken, config.Server, 'breeder');
                        // mailer.sendEmail(config.mailthrough, req.body.email, 'Please verify your email!', html);
                        return res.status(200).send({status: 200, message: 'Breeder Registered Successfully', data: success});
                    }).catch(error => {
                        console.log(error);
                        return res.json({ status: 400, message: "Something wents wrong" });
                    })
                } else if(resultUser.role.includes('admin')) {
                    return  res.json({ status: 400, message: "Wrorng Email" });
                } else if(resultUser.role.includes('breeder')) {
                    return  res.json({ status: 400, message: "Email is already registered as breeder" });
                } 
                // else {
                //     // Modify user to register breeder..
                //     this.modifyUserWithRole(req.body.email, req.body, 'breeder').then(resultUser => {
                //         return res.status(200).send(resultUser);
                //     }).catch(error => {
                //         console.log(error);
                //         return res.status(400).json({ status: 400, message: "Internal Server Error" });
                //     });
                // }
            });
            

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


    async registerUserWithRole(body, role, token=false)  {
        return new Promise((resolve, reject) => {
            console.log(token);
            const user = new User({...body,  ...{role: role}});
            if(token) user.secretToken = randomstring.generate();
            user.save((err, doc) => {
                console.log(err);
                if (err) reject({error: err, response: { status: 400, message: "Email is already registered", errors: err, data: {} }})

                console.log(doc);

                // Send email to breeder..
                // Email is pending for later use.. 
                if(token) {
                    const html = registeremail(doc.secretToken, config.webServer, role);
                    mailer.sendEmail(config.mailthrough, doc.email, 'Please verify your email!', html);
                    console.log('sending email');
                    return resolve({ status: 200, message: "Verification email is send", data: doc });
                } else {

                    if(role === 'employee') {
                        console.log('employee email');
                        console.log (body);
                        const html = employeeEmail(body.breederUniqueId, body.email, body.password);
                        mailer.sendEmail(config.mailthrough, body.email, 'Email for logly employee', html);
                        console.log('sending email');
                    }
                    return resolve({ status: 200, message: "Registered Successfully", data: doc });
                }
            });    
        });
    }

    async testSendMail(req, res, next) {
        const html = registeremail('token', config.Server, 'breeder');
        mailer.sendEmail(config.mailthrough, 'bilal@livewirelabs.co', 'Please verify your email!', html);
        console.log('sending email');
        res.status(200).json({ status: 200, message: "email is send"});
    }




    // Not in use..
    async modifyUserWithRole(email, data, role) {
        return new Promise((resolve, reject) => {
            User.updateOne({email}, {$set: {...data}, $push: {role}}).then(updatedUser => {
                console.log(updatedUser);
                return resolve({status: 200, message: "Registered Successfully"});
            }).catch(error => {
                return reject(error);
            })
        });
    }

    async forgotPassword(req, res, next) {
        try {
            if (!req.body.email) {
                return res.json({ status: 400, message: "Email field is required", data: {} });
            }

            User.findOne({ email: req.body.email }).then(user => {
                if (!user) {
                    return res.json({ status: 400, message: "Email does not exist", data: {} });
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
                let html = forgetpasswordemail(req.body.email, config.webServer, token)
                mailer.sendEmail(config.mailthrough, req.body.email, 'Password reset instructions', html);
                res.status(200).json({ status: 200, message: "email is send to recover password", data: { id: user._id, resettoken: user.resetToken } });

            })
        } catch (error) {
            return next(error);
        }
    }


    async isForgotTokenActive(req, res, next) {
        try {
            if (!req.query.token) return res.status(400).json({ status: 400, message: "Token is required", data: {} });

            User.findOne({ resetToken: removeQuote(req.query.token) }).then(resToken => {
                if (!resToken) return res.status(400).json({ status: 400, message: "Invalid token", data: {} });
                return res.status(200).json({ status: 200, message: "Token found successfully", data: { token: removeQuote(req.query.token) } })
            });
        } catch (error) {
            return next(error);
        }
    }


    async resetForgotPassword(req, res, next) {
        try {
            const { errors, isValid } = validateResetPassword(req.body);
            if (!isValid) return res.json({ status: 400, message: "Error presents", errors: errors, data: {} });
            const { password } = req.body;
            const { token } = req.params
            User.findOne({ resetToken: token }).then(user => {
                if (!user) return res.json({ status: 400, message: "Invalid token", data: {} });
                user.password = password;
                user.resetToken = '';
                user.save().then(resultSaved => {
                    res.status(200).json({ status: 200, message: "Password changed successfully", data: { token, password } });
                });
            })
        } catch (error) {
            return next(error);
        }
    }

    async getUserDetail(req, res, next) {
        try  {
            console.log('user detail called');
            User.findById(req.user._id).populate('dealCategories').then(resultUser => {
                return res.status(200).send({status: 200, data: {...resultUser.toObject(), coverImage: resultUser.toObject().coverImage ? `${config.baseImageURL}${resultUser.toObject().coverImage}` : null ,  image: resultUser.toObject().image ? `${config.baseImageURL}${resultUser.toObject().image}` : null , gallery: (resultUser.gallery && resultUser.gallery[0]) ? resultUser.toObject().gallery.map(e => ({...e, filename: `${config.baseImageURL}${e.filename}`})) : [] }});
            }).catch(error => {
                return res.status(400).json({ status: 400, message: "Internal Server Error", data: {} });
            });
        }  catch(error) {
            return next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            User.updateOne({_id: req.user._id}, {$set: req.body}).then(resultUser => {
                return res.send({status: 200, message: 'User updated successfully'});
            }).catch(error => {
                return res.json({ status: 400, message: error.message ? error.message : 'Internal Server Error', data: {}, error });
            });
        } catch(error) {
            return next(error);
        }
    }

    async updateImage(req, res, next) {
        try {
            User.updateOne({_id: req.user._id}, {$set: {[req.body.name]: req.file.filename}}).then(resultUser => {
                return res.send({status: 200, message: 'Image updated successfully'});
            }).catch(error => {
                return res.json({ status: 400, message: error.message ? error.message : 'Internal Server Error', data: {}, error });
            });
        } catch(error) {
            return next(error);
        }
    }


    async resetPassword() {

    }

    async getAllBreedersId() {
        return User.find({ role: 'breeder' }).then(breederResult => breederResult.map((value) => value._id));
    }


    async dashboardAnalysis(req, res, next) {
        try {
            const {_id} = req.user;
            Animal.aggregate([
                {$match: {breederId: _id}},
                { $group: { _id: "$breederId", animalSold: {$sum: '$soldQuantity'}, aliveQuantity: {$sum: '$aliveQuantity'}, sickQuantity: {$sum: '$sickQuantity'}, deadQuantity: {$sum:  '$deadQuantity'}, pregnantQuantity: {$sum: '$pregnantQuantity'}  } },
            ]).then((animalResult) => {
                // Sale.find({sellerId: _id})
                return res.send({status: 200, message: 'Dashboard Data found successfully', data: {animal: animalResult}});
            })
        } catch(error) {
            return next(error);
        }
    }


    async setupWizard(req, res, next) {
        try  {
            const {selectedAnimalForms, selectedProductForm, employeeArray} = req.body;
            console.log(selectedAnimalForms);
            Promise.all([
                new Promise(async (resolve, reject) => {
                    let resultForm = await Form.find({_id: {$in: [...selectedAnimalForms, ...selectedProductForm]}});
                    resultForm = resultForm.map(e => e.toObject());
                    resultForm = resultForm.map(e => ({...e, breedersId: [...e.breedersId, ...[req.user._id]], formStructure: e.formStructure.map(fs => ({...fs, breedersId: [...fs.breedersId, ...[{_id: req.user._id}]]}))}))
                    // console.log(resultForm);
                    // resultForm[0].save().then(resultComplete=> {
                    //     console.log('saved [0]');
                    // })
                    

                    
                    resultForm.forEach(form  => {
                       Form.updateOne({_id: form._id}, form).then(resultModified => {
                           console.log('modified successfully');
                       })
                    });
                    resolve();
                }),
                new Promise((resolve, reject) => {
                    employeeArray.forEach(employee => {
                        employee.breederUniqueId = req.user.uid;
                        User.findOne({email: employee.email, role: 'employee', breederId: req.user._id, isEmployeeActive: true }).then(resultUser => {
                            this.registerUserWithRole(employee, 'employee', false).then(success => {
                                console.log('employee added');
                            });
                        });
                    });
                    resolve();
                }),
            ]).then(([animal, product, employee]) => {
                User.updateOne({_id: req.user._id}, {$set: {setupWizardCompleted: true}}).then(resultComplted => {
                    return res.send({status: 200, message: 'Setup Wizard Completed!'});
                });
            });
            

        } catch(error) {
            return next(error);
        }
    }

};

module.exports = new UserController();