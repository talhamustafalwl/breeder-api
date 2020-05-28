const { User } = require("../models/User");
class UserController {
    constructor() { }

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


    async isblocked(req,res){
        if (!req.body.isblocked) {
            return res.json({status:400,message:"isblocked field is required",errors:{file:"isblocked field is required"},data:{}})
           }
        try {
            const user = await User.updateMany( {$or:[{_id:req.params.id},{breederId:req.params.id}]}, req.body);
            return res.status(200).json({ status: 200, message: "Breeder and all its emp blocked successfully", data: user });
        } catch (err) {
            return res.json({ status: 400, message: "Error in blocking Breeder and all its emp", errors: err, data: {} });
        }
    }

};

module.exports = new UserController();