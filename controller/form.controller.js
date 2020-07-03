const { Form } = require("../models/Form/Form");
const { User } = require("../models/User");
const { roleValues } = require('../config/roles');
const { getCategoryByIdAndFindParent } = require('./category.controller');
const {getAllBreedersId} = require('./user.controller');
const { validateAddForm } = require('../validation/form');
const { Mongoose } = require("mongoose");
class FormController {
    constructor() {
        this.addForm = this.addForm.bind(this);
    }

    getFormByCategory(req, res, next) {
        try {
            const { categoryId } = req.params;
            if (!categoryId) return res.json({ status: 400, message: "Category Required", data: {} });

            Form.findOne({ categoryId }).then(formResult => {
                return res.status(200).json({ status: 200, message: "Data Fetched Successfully", data: formResult });
            }).catch(err => {
                return res.json({ status: 400, message: "Error Fetching form Data", errors: err, data: {} });
            })
        } catch (err) {
            return next(err);
        }
    }

    getAllForms(req, res, next) {
        try {
            Form.find().then(result => {
                return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data: result });
            });
        } catch (err) {
            return next(err);
        }
    }

    addForm(req, res, next) {
        try {
            // Form.remove().then(result => {
            //     console.log(result);
            //     return res.status(200).json({ status: 200, message: "removed" });
            // })
            if (!req.user.isAdmin) return res.status(200).json({ status: 400, message: "Only admin can add form" })
            console.log(req.user);
            // validate add form parameter body .... 
            const { errors, isValid } = validateAddForm(req.body);
            if (!isValid) {
                return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
            }

            Form.find({ categoryId: req.body.categoryId }).then(catAvailiable => {

                if (catAvailiable[0]) {
                    return res.json({ status: 400, message: "Form is already available for this category" });
                }

                getCategoryByIdAndFindParent(req.body.categoryId).then(categoryResult => {
                    console.log('category res');
                    if (categoryResult.error) return res.json({ status: 400, message: categoryResult.message });
                    // getAllBreedersId()
                    getAllBreedersId().then(breedersId => {
                        const form = new Form({ ...req.body, ...{ userId: req.user._id, userType: req.user.role, breedersId } });
                        form.save().then(async result => {
                            return res.status(200).json({ status: 200, message: "Form Created Successfully", data: result });
                            // await this.cloneFormToBreeder(req.body).then(result => {
                            //     console.log(result);
                            // }).catch(err => {
                            //     return res.json({ status: 400, message: "Form created but error cloning to breeder", errors: err, data: {} });
                            // });
                        }).catch(err => {
                            console.log(err.message);
                            return res.json({ status: 400, message: err.message ? err.message : "Error Creating form", err, data: {} });
                        })
                    })
                  
                })
            });




        } catch (err) {
            return next(err);
        }
    }

    // async cloneFormToBreeder(data) {
    //     return new Promise((resolve, reject) => {
    //         User.find({ role: roleValues.breeder }).then(result => result.map(user => (new Form({ ...data, ...{ userId: user._id, userType: roleValues.breeder } })))).then(resultUsers => {
    //             console.log(resultUsers);
    //             Form.insertMany(resultUsers).then(success => resolve(success)).catch(error => reject(error));
    //         }).catch(err => reject(err));
    //     });
    // }


    async cloneFormToBreeder(id) {
        return new Promise((resolve, reject) => {
            Form.cloneFormToBreeder(id, resolve);
        })
    }

    async modifyForm(req, res, next) {
        try {
            const { id } = req.params;
            console.log(id);
            if (!id) return res.json({ status: 400, message: "Id parameter is required", data: {} });
            console.log(req.body);
            const form = await Form.findOneAndUpdate({ _id: id }, req.body).catch(err => {
                console.log(err);
                return res.json({ status: 400, message: "Error in modifying form", errors: err, data: {} });
            });
            return res.status(200).json({ status: 200, message: "Form modified successfully", data: form });
        } catch (err) {
            return next(err);
        }
    }
}


module.exports = new FormController();