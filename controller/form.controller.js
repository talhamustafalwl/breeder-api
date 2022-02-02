const { Form } = require("../models/Form/Form");
const { User } = require("../models/User");
const { roleValues } = require("../config/roles");
const { getCategoryByIdAndFindParent } = require("./category.controller");
const { getAllBreedersId } = require("./user.controller");
const { validateAddForm } = require("../validation/form");
const { Mongoose, Document } = require("mongoose");
const config = require("../config/key");
const { Animal } = require("../models/Animal/Animal");
const { Product } = require("../models/Product");
const { serverURL } = require("../config/dev");
const { FormValueRequest } = require("../models/Form/FormValueRequest");
const notificationController = require("./notification.controller");
const notificationMessages = require("../config/notificationMessages");
const notificationConfig = require("../config/notificationConfig");

class FormController {
  constructor() {
    this.addForm = this.addForm.bind(this);
  }

  addBreederInForm(breederId, categoryId, sellerId) {
    console.log("in add breeer in form");
    return new Promise((resolve, reject) => {
      Form.findOne({ categoryId })
        .then((resultForm) => {
          console.log(
            "Breeder id included or not  ? ",
            resultForm.breedersId.includes(breederId)
          );
          if (resultForm.breedersId.includes(breederId)) resolve();
          console.log("adding breeder Id");
          // resultForm = resultForm.toObject();
          // console.log(sellerId);
          // console.log(resultForm.toObject().formStructure.map(e => ({...e, breedersId: e.breedersId.map(eb => eb._id).includes(sellerId) ? [...e.breedersId, ...[{_id: breederId}]] : e.breedersId})));
          resultForm.formStructure = resultForm
            .toObject()
            .formStructure.map((e) => ({
              ...e,
              breedersId: [...e.breedersId, ...[{ _id: breederId }]],
            }));
          resultForm.breedersId = [
            ...resultForm.toObject().breedersId,
            ...[breederId],
          ];
          console.log("resolve");
          resultForm
            .save()
            .then((success) => {
              console.log(success);
              resolve();
            })
            .catch((error) => {
              console.log(error);
              reject();
            });
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  getFormByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      if (!categoryId)
        return res.json({
          status: 400,
          message: "Category Required",
          data: {},
        });
      console.log(categoryId);
      Form.findOne({ categoryId })
        .populate("categoryId")
        .then((formResult) => {
          const reusltData = {
            ...formResult.toObject(),
            formStructure: formResult.toObject().formStructure.map((e) =>
              e.name === "breed"
                ? { ...e, values: formResult.toObject().categoryId.breeds }
                : e.name === "traits"
                ? { ...e, values: formResult.toObject().categoryId.traits }
                : e.name === "subCategory"
                ? {
                    ...e,
                    values: formResult.toObject().categoryId.subCategories,
                  }
                : e
            ),
          };
          return res.status(200).json({
            status: 200,
            message: "Data Fetched Successfully",
            data: reusltData,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            status: 400,
            message: "Error Fetching form Data",
            errors: err,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  getForms(req, res, next) {
    try {
      console.log("get form called");
      Form.find({ published: true })
        .lean()
        .sort({ createdAt: -1 })
        .populate("categoryId")
        .exec(function (error, result) {
          console.log("forms found successfully --- ", result);
          // console.log(result);
          if (req.query.type) {
            // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
            console.log("type = ", req.query.type);
            // console.log(
            //   result.filter(
            //     (e) => e.toObject().categoryId.type === req.query.type
            //   )
            // );
            const finalRes = result
              .filter((item) => item.categoryId.type === req.query.type)
              .map((item) => ({
                ...item,
                ...{
                  categoryId: {
                    ...item.categoryId,
                    ...{
                      icon: item.categoryId
                        ? `${config.imageURL}${item.categoryId.icon}`
                        : "",
                    },
                  },
                },
                ...{
                  formStructure: item.formStructure.map((fst) =>
                    req.query.type === "animal" && fst.name === "breed"
                      ? {
                          ...fst,
                          ...{ values: item.categoryId.breeds },
                        }
                      : req.query.type === "product" &&
                        fst.name === "subCategory"
                      ? {
                          ...fst,
                          ...{
                            values: item.categoryId.subCategories,
                          },
                        }
                      : fst
                  ),
                },
              }));
            console.log("Data fetched Successfully");
            return res.status(200).json({
              status: 200,
              message: "Data Fetched Successfully",
              data: finalRes,
            });
          } else {
            // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
            const finalRes = result.map((item) => ({
              ...item,
              ...{
                categoryId: {
                  ...item.categoryId,
                  icon: item.categoryId
                    ? `${config.imageURL}${item.categoryId.icon}`
                    : "",
                  // ...{
                  //   icon: `${config.imageURL}${e.categoryId.icon}`,
                  // },
                },
              },
            }));
            console.log("In else data fetched successfully");
            return res.status(200).json({
              status: 200,
              message: "Data Fetched Successfully",
              data: finalRes,
            });
          }
        });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  getAllForms(req, res, next) {
    try {
      console.log(req.user.role);
      if (req.user.role.includes("breeder")) {
        Form.find({ breedersId: req.user._id, published: true })
          .lean()
          .sort({ createdAt: -1 })
          .populate("categoryId")
          .exec(function (error, result) {
            // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
            const finalRes = result.map((item) => {
              const icon =
                item.categoryId && item.categoryId.icon
                  ? `${config.imageURL}${item.categoryId.icon}`
                  : "";
              return {
                categoryId: {
                  ...item.categoryId,
                  icon,
                },
              };
              // return {

              // ...{
              //   categoryId: {
              //     ...e.categoryId,
              //     ...{
              //       icon: `${config.imageURL}${e.categoryId.icon}`,
              //     },
              //   },
              // },
              // };
            });
            console.log({ finalRes });
            return res.status(200).json({
              status: 200,
              message: "Data Fetched Successfully",
              data: finalRes,
            });
          });
      } else {
        Form.find()
          .sort({ createdAt: -1 })
          .populate("categoryId")
          .exec()
          .then((result) => {
            const finalRes = result.map((e) => ({
              ...e.toObject(),
              ...{
                categoryId: {
                  ...e.categoryId.toObject(),
                  ...{
                    icon: `${config.imageURL}${e.categoryId.toObject().icon}`,
                  },
                },
              },
            }));
            return res.status(200).json({
              status: 200,
              message: "Data Fetched Successfully",
              data: finalRes,
            });
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
      if (!req.user.isAdmin)
        return res
          .status(200)
          .json({ status: 400, message: "Only admin can add form" });
      console.log(req.user);
      // validate add form parameter body ....
      const { errors, isValid } = validateAddForm(req.body);
      if (!isValid) {
        return res.json({
          status: 400,
          message: "errors present",
          errors: errors,
          data: {},
        });
      }

      Form.find({ categoryId: req.body.categoryId })
        .then((catAvailiable) => {
          if (catAvailiable[0]) {
            return res.json({
              status: 400,
              message: "Form is already available for this category",
            });
          }

          getCategoryByIdAndFindParent(req.body.categoryId).then(
            (categoryResult) => {
              console.log("category res");
              console.log(req.user.role);
              if (categoryResult.error)
                return res.json({
                  status: 400,
                  message: categoryResult.message,
                });
              // getAllBreedersId()

              // Remove all the breeders to add when from create....
              // Can be undo by uncomment the code down..
              // ####################################################
              const form = new Form({
                ...req.body,
                ...{
                  userId: req.user._id,
                  userType: req.user.role[0],
                  breedersId: [],
                },
              });
              form
                .save()
                .then(async (result) => {
                  return res.status(200).json({
                    status: 200,
                    message: "Form Created Successfully",
                    data: result,
                  });
                  // await this.cloneFormToBreeder(req.body).then(result => {
                  //     console.log(result);
                  // }).catch(err => {
                  //     return res.json({ status: 400, message: "Form created but error cloning to breeder", errors: err, data: {} });
                  // });
                })
                .catch((err) => {
                  console.log(err.message);
                  return res.json({
                    status: 400,
                    message: err.message ? err.message : "Error Creating form",
                    err,
                    data: {},
                  });
                });

              // This is the line that add all breeders in form..
              // ##################################################
              // getAllBreedersId().then(breedersId => {

              // }).catch(err => {
              //     console.log(err)
              //     return res.json({ status: 400, message: err.message ? err.message : "Internal Server Error", err, data: {} });
              // })
            }
          );
        })
        .catch((err) => {
          return res.json({
            status: 400,
            message: err.message ? err.message : "Internal Server Error",
            err,
            data: {},
          });
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
    });
  }

  async modifyForm(req, res, next) {
    try {
      const { id } = req.params;

      console.log(id);
      if (!id)
        return res.json({
          status: 400,
          message: "Id parameter is required",
          data: {},
        });
      console.log(req.body);
      const form = await Form.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      }).catch((err) => {
        console.log(err);
        return res.json({
          status: 400,
          message: "Error in modifying form",
          errors: err,
          data: {},
        });
      });
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      console.log("updated value is ");
      console.log(form.breedersId.filter(onlyUnique));

      if (req.body.published != undefined) {
        console.log("in pubslish case");
        const uniqueBreeders = form.breedersId.filter(onlyUnique);
        const notifMessage = notificationMessages.formPublish(
          req.body.published
        );
        console.log(notifMessage);
        User.find({ _id: { $in: uniqueBreeders } }).then((responseUser) => {
          const data = responseUser
            .map((e) => e.toObject())
            .map((e) => ({
              ...e,
              title: notifMessage.title,
              description: notifMessage.description,
              userId: e._id,
              breederId: e._id,
              notificationType: notificationConfig.notificationType.breeder,
              notificationSubType:
                notificationConfig.notificationSubType.announcement,
              data: {},
              isPush: e.notificationSettings.formPublish,
            }));
          notificationController.createMultiple(data, true);
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Form created successfully",
        removeMessage: "Form removed successfully",
        editMessage: "Form updated Successfully",
        data: form,
      });
    } catch (err) {
      return next(err);
    }
  }

  // Only breeder can modify values of any fields here ..
  async modifyValuesRequestB(req, res, next) {
    console.log(req.body);
    try {
      const { formId, formStructureId, data } = req.body;
      Form.findById(formId).then((resultForm) => {
        var individualForm = resultForm.formStructure.id(formStructureId);
        if (individualForm.values.map((e) => e.value === data.value)[0])
          return res.json({ status: 400, message: "Value already exist" });
        if (
          individualForm.modifiedValuesRequest.map(
            (e) => e.value === data.value
          )[0]
        )
          return res.json({
            status: 400,
            message: "Value already exist in request",
          });
        individualForm.modifiedValuesRequest.push({
          ...data,
          ...{
            status: "pending",
            modifiedBy: req.user._id,
            modifiedAt: new Date(),
          },
        });
        resultForm.save().then((_) => {
          return res.status(200).send({
            status: 200,
            user: resultForm,
            message: "Request has been successfully send to admin.",
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async modifyValuesRequest(req, res, next) {
    req.body.value = req.body.data.value;
    req.body.breederId = req.user.role.includes("employee")
      ? req.user.breederId
      : req.user._id;
    req.body.requestedBy = req.user._id;
    console.log(req.body);
    try {
      FormValueRequest.findOne({
        formStructureId: req.body.formStructureId,
        formId: req.body.formId,
        value: req.body.value,
      }).then((match) => {
        if (!match) {
          FormValueRequest.create(req.body).then((result) => {
            return res.status(200).send({
              status: 200,
              user: result,
              message: "Request has been successfully send to admin",
            });
          });
        } else {
          return res.send({
            status: 200,
            user: [],
            message: "Same item request has already been send",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async modifyValuesRequestGet(req, res, next) {
    console.log(req.body);
    try {
      FormValueRequest.find({ status: "pending" })
        .populate("formId")
        .populate("requestedBy", "name")
        .populate("categoryId", "name")
        .sort({ createdAt: -1 })
        .then((resultForm) => {
          return res.status(200).send({
            status: 200,
            data: resultForm,
            message: "Pending Requests",
          });
        });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        data: [],
        message: "Error in getting Pending Requests",
      });
    }
  }

  async modifyValuesRequestAdd(req, res, next) {
    try {
      FormValueRequest.findOne({ _id: req.body._id, status: "pending" }).then(
        async (result) => {
          if (result) {
            if (req.body.status && req.body.status === "approved") {
              result.status = "approved";
              await result.save();
              await Form.findById(req.body.formId).then((resultForm) => {
                var individualForm = resultForm.formStructure.id(
                  req.body.formStructureId
                );
                individualForm.values.push({
                  ...individualForm.values,
                  ...{ name: result.value, value: result.value },
                });
                resultForm.save().then((_) => {
                  return res.status(200).send({
                    status: 200,
                    user: resultForm,
                    message: "Field is Added Successfully",
                  });
                });
              });
            } else {
              result.status = "rejected";
              await result.save();
              return res.status(200).send({
                status: 200,
                user: [],
                message: "Field is Rejected Successfully",
              });
            }
          } else {
            return res.send({
              status: 200,
              data: [],
              message: "Error in Request approval (Not Found)",
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ status: 400, data: [], message: "Error in Request approval" });
    }
  }

  async modifyValuesRequestDelete(req, res, next) {
    console.log("req.body==>>", req.body);
    try {
      FormValueRequest.deleteMany({ formStructureId: { $in: req.body } }).then(
        () => {
          return res
            .status(200)
            .json({ status: 200, message: "Removed successfully" });
        }
      );
    } catch (error) {
      return res.send({ status: 400, data: [], message: "Error in deleting" });
    }
  }

  async modifyValuesRequestDeleteFormId(req, res, next) {
    console.log("req.params.id-->", req.params.id);
    try {
      FormValueRequest.deleteMany({ formId: req.params.id }).then(() => {
        return res
          .status(200)
          .json({ status: 200, message: "Removed successfully" });
      });
    } catch (error) {
      return res.send({ status: 400, data: [], message: "Error in deleting" });
    }
  }

  async getRegisteredFormsOfBreeder(req, res, next) {
    try {
      console.log("registered form of breeder");
      if (
        req.user.role.includes("breeder") ||
        req.user.role.includes("employee")
      ) {
        Form.find({
          breedersId: req.user.role.includes("employee")
            ? req.user.breederId
            : req.user._id,
        })
          .populate("categoryId")
          .exec(function (error, result) {
            Form.populate(
              result,
              { path: "categoryId.parentId" },
              (err, resultForm) => {
                console.log(resultForm);
                // const finalRes = result.map(e => {return {e, ...{categoryId: {...e.categoryId, ...{icon: `${config.imageURL}${e.categoryId.icon}` }}}}});
                // const finalRes = result.map(e => ({...e.toObject(), ...{categoryId: {...e.categoryId.toObject(), ...{icon: `${config.imageURL}${e.categoryId.toObject().icon}` }}}}));

                // const finalRes = resultForm.filter(
                // (e) => console.log("e", e.toObject().categoryId)
                // e.toObject().categoryId.type === req.query.type
                const finalRes = resultForm
                  .filter(
                    (e) => e.toObject().categoryId.type === req.query.type
                  )
                  .map((e) => ({
                    ...e.toObject(),
                    ...{
                      formStructure: e.toObject().formStructure.map((fst) =>
                        fst.name === "breed"
                          ? {
                              ...fst,
                              ...{ values: e.toObject().categoryId.breeds },
                            }
                          : fst
                      ),
                    },
                  }));
                console.log("final result is ");
                return res.status(200).json({
                  status: 200,
                  message: "Data Fetched Successfully",
                  data: finalRes,
                });
              }
            );
          });
      } else {
        console.log("else");
        Form.find()
          .populate("categoryId")
          .exec()
          .then((result) => {
            return res.status(200).json({
              status: 200,
              message: "Data Fetched Successfully",
              data: result,
            });
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
    } catch (error) {
      console.log(error);
    }
  }

  async acceptModifyValuesRequest() {
    try {
    } catch (error) {}
  }

  async deleteFormByCategoryId(categoryId) {
    return new Promise((resolve, reject) => {
      Form.deleteOne({ categoryId })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async deleteFormAdmin(req, res, next) {
    try {
      Form.findByIdAndDelete(req.params.id).then(() => {
        return res
          .status(200)
          .json({ status: 200, message: "Form removed successfully" });
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteFormByCategory(req, res, next) {
    try {
      const { categoryId, id } = req.params;
      console.log("===>>>>", categoryId, id);

      Animal.find({
        categoryId,
        ...(req.user.isAdmin ? {} : { breederId: req.user._id }),
      }).then((result) => {
        if (result && result.length > 0) {
          console.log("===>>>>", result.length);
          return res.json({
            status: 400,
            message:
              "Can not remove category because animal is added on this category",
            data: {},
          });
        }

        Product.find({
          categoryId,
          ...(req.user.isAdmin ? {} : { breederId: req.user._id }),
        }).then((result2) => {
          if (result2 && result2.length > 0) {
            console.log("===>>>>", result2.length);
            return res.json({
              status: 400,
              message:
                "Can not remove category because product is added on this category",
              data: {},
            });
          }

          Form.findByIdAndDelete(id).then(() => {
            return res
              .status(200)
              .json({ status: 200, message: "Form removed successfully" });
          });
        });
      });
    } catch (error) {
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
