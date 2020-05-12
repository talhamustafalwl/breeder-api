const {validateContact} = require('../validation/contact');
const {Contact} = require('../models/Contact/Contact');
class ContactController {
    constructor() {

    }

    // breeder and employee both can add contact ... 
    async addContact(req, res, next) {
        try {
            const {errors, isValid} = await validateContact(req.body);
            console.log(errors);
            console.log(isValid);
            if(!isValid) return res.status(400).send({status: 400, message: "errors present", errors});
            const contact = await new Contact({...req.body, ... {createdBy: req.user._id , lastEditBy: req.user._id}});
            contact.save().then(result => {
                return res.status(200).json({ status: 200, message: "contacts created successfully", data: result });

            }).catch(err => {
                return res.json({ status: 400, message: "Error in creating contacts ", errors: err, data: {} });
            });
        } catch(error) {
            return next(error);
        }
    }

    getContact(req, res, next) {
        try {

        } catch(error) {
            return next(error);
        }
    }

}


module.exports = new ContactController();