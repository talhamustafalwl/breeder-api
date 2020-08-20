const { User } = require("../models/User");
const { validateLoginInput, validateRegisterInput, validateRegisterInputEmp, validateRegisterInputBreeder, validateResetPassword } = require("../validation/users");
const mailer = require('../misc/mailer');
const randomstring = require('randomstring');

const config = require("../config/key");
const registeremail = require('../emails/register');
// const formController = require("./form.controller");
const {removeQuote} = require('../middleware/constant');

class UserController {
    constructor() { 
        // this.registerUserWithRole = this.registerUserWithRole.bind(this);
        this.registerBreeder = this.registerBreeder.bind(this);
        this.registerEmployees = this.registerEmployees.bind(this);
    }
    
    authentication(req, res, next) {
        try {
            return res.status(200).json({
                status: 200, message: "auth user success", isAuth: true,
                isAdmin: req.user.role === "admin" ? true : false,
                data: {
                    _id: req.user._id,
                    email: req.user.email,
                    name: req.user.name
                }
            });
        } catch (err) {
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
                return res.status(200).json({ status: 200, message: "Employee found successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error fetching employees", errors: error, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }


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


            User.findOne({email: req.body.email}).then(resultUser => {
                console.log(resultUser + ' user');
                if(!resultUser) {
                    req.body.uid = randomstring.generate({length: 8, charset: 'numeric'});
                    // Register user... 
                    this.registerUserWithRole(req.body, 'employee', false).then(success => {
                        console.log(success);
                        return res.status(200).send({status: 200, message: 'Employee Registered Successfully', data: success});
                    }).catch(error => {
                        console.log(error);
                        return res.json({ status: 400, message: "Something wents wrong" });
                    })
                } else if(resultUser.role.includes('admin')) {
                    return res.json({ status: 400, message: "Wrorng Email" });
                } else if(resultUser.role.includes('employee')) {
                    return res.json({ status: 400, message: "Email is already registered as employee" });
                } else {
                    console.log('Updating user');
                    req.body.uid = randomstring.generate({length: 8, charset: 'numeric'});
                    // Modify user to register breeder..
                    this.modifyUserWithRole(req.body.email, req.body, 'employee').then(resultUser => {
                        return res.status(200).send(resultUser);
                    }).catch(error => {
                        console.log(error);
                        return res.status(400).json({ status: 400, message: "Internal Server Error" });
                    })
                }
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
        } catch (err) {
            return next(err);
        }
    }


    async editEmployee(req, res, next) {
        try {
            User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(result => {
                return res.status(200).json({ status: 200, message: "Employee updated successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error updating employees", errors: error, data: {} });
            });
        } catch (error) {
            return next(error);
        }
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
            User.findOne({email: req.body.email}).then(resultUser => {
                console.log(resultUser + ' user');
                if(!resultUser) { 
                    // Register user... 
                    this.registerUserWithRole(req.body, 'breeder', true).then(success => {
                        console.log(success);
                        return res.status(200).send({status: 200, message: 'Breeder Registered Successfully', data: success});
                    }).catch(error => {
                        console.log(error);
                        return res.json({ status: 400, message: "Something wents wrong" });
                    })
                } else if(resultUser.role.includes('admin')) {
                    return  res.json({ status: 400, message: "Wrorng Email" });
                } else if(resultUser.role.includes('breeder')) {
                    return  res.json({ status: 400, message: "Email is already registered as breeder" });
                } else {
                    // Modify user to register breeder..

                    this.modifyUserWithRole(req.body.email, req.body, 'breeder').then(resultUser => {
                        return res.status(200).send(resultUser);
                    }).catch(error => {
                        console.log(error);
                        return res.status(400).json({ status: 400, message: "Internal Server Error" });
                    })

                }
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
            const user = new User({...body,  ...{role: [role]}});
            if(token) user.secretToken = randomstring.generate();
            user.save((err, doc) => {
                console.log(err);
                if (err) reject({error: err, response: { status: 400, message: "Email is already registered", errors: err, data: {} }})

                console.log(doc);

                // Send email to breeder..
                // Email is pending for later use.. 
                if(token) {
                    // const html = registeremail(doc.secretToken, config.Server, role);
                    // mailer.sendEmail(config.mailthrough, doc.email, 'Please verify your email!', html);
                    console.log('sending email');
                    return resolve({ status: 200, message: "Verification email is send", data: doc });
                } else {
                    return resolve({ status: 200, message: "Registered Successfully", data: doc });
                }
            });    
        });
    }

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
                    return res.json({ status: 400, message: "Email do not exists", data: {} });
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


    async resetPassword() {

    }

    async getAllBreedersId() {
        return User.find({ role: 'breeder' }).then(breederResult => breederResult.map((value) => value._id));
    }

};

module.exports = new UserController();