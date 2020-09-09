const {validateContact} = require('../validation/contact');
const {Contact} = require('../models/Contact/Contact');
class ContactController {
    constructor() {

    }


    // breeder and employee both can add contact ... 
    async addContact(req, res, next) {
        //req.body.breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        req.body.breederId="5f3ba1f7a989412710841d5a"
        try {
            const {errors, isValid} = await validateContact(req.body);
            console.log(errors);
            console.log(isValid);
            if(!isValid) return res.status(400).send({status: 400, message: "errors present", errors});
            const contact = await new Contact({...req.body, ... {addedBy: req.user._id }});
            contact.save().then(result => {
                return res.status(200).json({ status: 200, message: "Contact created successfully", data: result });

            }).catch(err => {
                return res.json({ status: 400, message: "Error in creating Contact ", errors: err, data: {} });
            });
        } catch(error) {
            return next(error);
        }
    }





    async getContacts(req, res, next) {
        //const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        console.log(req.user._id)
        const breederId="5f3ba1f7a989412710841d5a"
        try {
            Contact.aggregate( [
                {$group:{_id:{$substr: ['$name', 0, 1]}, detail:{$push:"$$ROOT"}}},
                { $sort: { _id : 1 } }
            ])
            //Contact.find(req.user.role === 'admin' ?  {} :{addedBy:req.user._id})
            .then(result => {
                let detail=result.map(e=> {return {[e._id]:e.detail}}) 
                let object = Object.assign({}, ...detail);

                 return res.status(200).json({ status: 200, message: "contacts fetched successfully", data: object})
            }).catch(error => {
                return res.json({ status: 400, message: "Error in fetching contacts ", errors: error, data: {} });
            })
        } catch(error) {
            return next(error);
        }
    }

    getContact(req, res, next) {
        try {
            Contact.findById(req.params.id).then(result => {
                return res.status(200).json({ status: 200, message: "contact find successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error in fetching contact ", errors: error, data: {} });
            })
        } catch(error) {
            return next(error);
        }
    }


    UpdateContact(req, res, next) {
        //const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        const breederId="5f3ba1f7a989412710841d5a"
        try {
            Contact.findOneAndUpdate({_id:req.params.id}, {$set: req.body}, { new: true }).then(result => {
                return res.status(200).json({ status: 200, message: "contacts updated successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error in updateding contacts ", errors: error, data: {} });
            })
        } catch(error) {
            return next(error);
        }
    }

}


module.exports = new ContactController();