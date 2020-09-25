const { Form } = require("../models/Form/Form");
const { User } = require("../models/User");
const { roleValues } = require('../config/roles');
const { getCategoryByIdAndFindParent } = require('./category.controller');
const {getAllBreedersId} = require('./user.controller');
const { validateAddForm } = require('../validation/form');
const { Mongoose, Document } = require("mongoose");
const config  = require('../config/key');
const { Animal } = require("../models/Animal/Animal");
const { serverURL } = require("../config/dev");
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

    getForms(req, res, next) {
        try {
            console.log('get form called');
            Form.find().populate('categoryId').exec(function (error, result ) {
                console.log(result);
                if(req.query.type) {
                    // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
                    console.log(req.query.type);
                    console.log(result.filter(e => (e.toObject().categoryId.type === req.query.type)));
                    const finalRes = result.filter(e => (e.toObject().categoryId.type === req.query.type)).map(e => ({...e.toObject(), ...{categoryId: {...e.categoryId.toObject(), ...{icon: `${config.imageURL}${e.categoryId.toObject().icon}` }}}}));
                    return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data:  finalRes});
                } else {
                        // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
                    const finalRes = result.map(e => ({...e.toObject(), ...{categoryId: {...e.categoryId.toObject(), ...{icon: `${config.imageURL}${e.categoryId.toObject().icon}` }}}}));
                    return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data:  finalRes});
              }
            });
        } catch (err) {
            return next(err);
        }
    }

    getAllForms(req, res, next) {
        try {
            console.log(req.user.role);
            if(req.user.role.includes('breeder')) {
                console.log('calling breeder form')
                Form.find({breedersId: req.user._id}).populate('categoryId')               
                .exec(function (error, result ) {
                    console.log(result);
                    // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
                    const finalRes = result.map(e => ({...e.toObject(), ...{categoryId: {...e.categoryId.toObject(), ...{icon: `${config.imageURL}${e.categoryId.toObject().icon}` }}}}));
                    return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data:  finalRes});
                });  
            } else  {
                Form.find().populate('categoryId').exec().then(result => {
                    return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data: result });
                });
            }
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
                    console.log(req.user.role);
                    if (categoryResult.error) return res.json({ status: 400, message: categoryResult.message });
                    // getAllBreedersId()

                    // Remove all the breeders to add when from create.... 
                    // Can be undo by uncomment the code down..
                    // ####################################################
                    const form = new Form({ ...req.body, ...{ userId: req.user._id, userType: req.user.role[0], breedersId: [] } });
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

                    // This is the line that add all breeders in form..
                    // ##################################################
                    // getAllBreedersId().then(breedersId => {
                        
                       
                    // }).catch(err => {
                    //     console.log(err)
                    //     return res.json({ status: 400, message: err.message ? err.message : "Internal Server Error", err, data: {} });
                    // })
                })
            }).catch(err  => {
                return res.json({ status: 400, message: err.message ? err.message : "Internal Server Error", err, data: {} });
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
            return res.status(200).json({ status: 200, message: "Form created successfully", removeMessage: "Form removed successfully" , editMessage: 'Form updated Successfully', data: form });
        } catch (err) {
            return next(err);
        }
    }


    // Only breeder can modify values of any fields here ..
    async modifyValuesRequest(req, res, next) {
        try {
            const { formId, formStructureId, data } = req.body;
            Form.findById(formId).then(resultForm => {
                var individualForm = resultForm.formStructure.id(formStructureId)
                if(individualForm.values.map(e => (e.value === data.value))[0]) return res.json({ status: 400, message: "Value already exist" });
                if(individualForm.modifiedValuesRequest.map(e => (e.value === data.value))[0]) return res.json({ status: 400, message: "Value already exist in request" });
                individualForm.modifiedValuesRequest.push({...data, ...{status: 'pending', modifiedBy: req.user._id, modifiedAt: new Date()}})
                resultForm.save().then(_ => {
                    return res.status(200).send({status: 200, user: resultForm, message: 'Request has been successfully send to admin.'});
                });               
            });
        } catch(error) {
            console.log(error);
        }
    }



    async getRegisteredFormsOfBreeder(req, res, next) {
        try {
            if(req.user.role.includes('breeder')) {
                console.log('calling breeder form')
                Form.find({breedersId: req.user._id}).populate('categoryId')               
                .exec(function (error, result ) {
                    Form.populate(result, {path: 'categoryId.parentId'}, (err, resultForm) => {
                        console.log(resultForm);
                        // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
                        // const finalRes = result.map(e => ({...e.toObject(), ...{categoryId: {...e.categoryId.toObject(), ...{icon: `${config.imageURL}${e.categoryId.toObject().icon}` }}}}));
                        const finalRes = resultForm.filter(e=> e.toObject().categoryId.type===req.query.type);
                        return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data:  finalRes});
                    })
                  
                });  
            } else  {
                Form.find().populate('categoryId').exec().then(result => {
                    return res.status(200).json({ status: 200, message: 'Data Fetched Successfully', data: result });
                });
            }
        } catch (err) {
            return next(err);
        }
    }

    // async forcefullyAcceptRequest(req, res, next) {
    //     try {

    //     } catch(error) {

    //     }
    // }


    async getAllModifiedValuesRequest() {
        try {
            // Form.find({})
        } catch(error) {
            console.log(error);
        }
    }

    async acceptModifyValuesRequest() {
        try  {
             
        } catch(error) {

        }
    }


    async deleteFormByCategory(req, res, next) {
        try { 
            const {categoryId} = req.params;
            Animal.findById(categoryId).then(result => {
                console.log(result);
                if(result) {
                    return res.json({ status: 400, message: "Can not remove category because animal is added on this category", errors: err, data: {} });
                }
                Form.deleteOne({categoryId}).then(resForm => {
                    return res.status(200).json({ status: 200, message: "Form removed successfully" });
                })
            })
        } catch(error) {
            return next(error);
        }
    }

    // async excludeBreederForm(req, res, next)
    //  {
    //     try { 
    //         const {id, breederId} = req.params;
    //         Form.findById(id).then(formResult => {
    //             if(!formResult) return res.json({ status: 400, message: "Form is not available", errors: err, data: {} });
    //             const newForm = formResult.map(e => ({...e, ...{breedersId: e.breedersId.filter(bf => !(bf._id===breederId)), formStructure: }}))
    //         });
    //         Animal.findById(categoryId).then(result => {
    //             console.log(result);
    //             if(result) {
    //                 return res.json({ status: 400, message: "Can not remove category because animal is added on this category", errors: err, data: {} });
    //             }
    //             Form.deleteOne({categoryId}).then(resForm => {
    //                 return res.status(200).json({ status: 200, message: "Form removed successfully" });
    //             })
    //         })
    //     } catch(error) {
    //         return next(error);
    //     }
    //  }
}


module.exports = new FormController();