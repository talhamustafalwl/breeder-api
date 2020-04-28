class UserController {
    constructor() { }

    authentication(req, res, next) {
        try {
            return res.status(200).json({
                status: 200, message: "auth user success", isAuth: true, data: {
                    // _id: req.user._id,
                    // isAdmin: req.user.role === 0 ? false : true,
                    // email: req.user.email,
                    // name: req.user.name,
                    // role: req.user.role
                    email: 'test@mail.com'
                }
            });
        } catch (err) {
            return next(err);
        }
    }

};

module.exports = new UserController();