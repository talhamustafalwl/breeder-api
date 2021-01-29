const {validateContact} = require('../validation/contact');
const {Contact} = require('../models/Contact/Contact');
const {User} = require('../models/User');
const categoryController = require('./category.controller');
const contact = require('../validation/contact');
const { Types } = require("mongoose");

class ContactController {
    constructor() {

    }


    // breeder and employee both can add contact ... 
    async addContact(req, res, next) {
        req.body.breederId=req.user.role == "employee" ? req.user.breederId : req.user._id;
        // req.body.breederId="5f3ba1f7a989412710841d5a"

        console.log(req.body.breederId,req.user._id)
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

    async getContactsBreeder(req, res, next) {
        //const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        console.log(req.user._id)
        try {
            User.aggregate( [ {$match : {role: 'breeder'}},
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




    async getContacts(req, res, next) {
        const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        //console.log(req.query.category ? "d" : "n")
        try {
            if(req.query.category){
                Contact.aggregate( [{$match: {category: Types.ObjectId(req.query.category),breederId}},
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
            }
            else{
                Contact.aggregate( [{$match: {breederId}},
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
            }

        } catch(error) {
            return next(error);
        }
    }



    getContactWithCategories( req, res, next) {
            try {
                console.log('get contact with categories');
                console.log (req.user);
                // categoryController.allCategories().then(categories => {
                    Contact.find({isRemoved: false, breederId: req.user.role.includes('breeder') ? req.user._id : req.user.breederId}).sort({ createdAt: -1 }).populate('category').then(contactResult => {
                        // data = categories.map(e => ({...e, ...{contacts: contactResult.filter(cr => cr.toObject().)}}));
                        return res.status(200).json({ status: 200, message: "Contacts with categories fetched successfully", data: contactResult})
                    });
                // })
            } catch(error) {
                return next(error);
            }
    }


    softRemoveContact(req, res, next) {
        try {
            console.log('soft remove called');
            console.log(req.params.id);
            Contact.updateOne({_id:req.params.id}, {$set: {isRemoved: true }}, { new: true }).then(result => {
                return res.status(200).json({ status: 200, message: "contacts removed successfully", data: result });
            }).catch(error => {
                console.log(error);
                return res.json({ status: 400, message: "Error in removeing contacts ", errors: error, data: {} });
            })
        } catch(error) {
            return next(error);
        }
    }

    softRemoveContactByCategory(req, res, next) {
        try {
            console.log('soft remove called');
            console.log(req.params.id);
            Contact.updateMany({category:req.params.category}, {$set: {isRemoved: true }}, { new: true }).then(result => {
                return res.status(200).json({ status: 200, message: "contacts removed successfully", data: result });
            }).catch(error => {
                console.log(error);
                return res.json({ status: 400, message: "Error in removed contacts ", errors: error, data: {} });
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
        console.log('contact updating')
        console.log(req.body);
        console.log(req.params._id);
        const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        // const breederId="5f3ba1f7a989412710841d5a"
        try {
            Contact.findOneAndUpdate({_id:req.params.id}, {$set: req.body}, { new: true }).then(result => {
                return res.status(200).json({ status: 200, message: "contacts updated successfully", data: result });
            }).catch(error => {
                console.log(error);
                return res.json({ status: 400, message: "Error in updateding contacts ", errors: error, data: {} });
            })
        } catch(error) {
            return next(error);
        }
    }

}


module.exports = new ContactController();