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

};

module.exports = new UserController();