const { Animal } = require("../models/Animal/Animal");
const { validateAnimalInput } = require("../validation/animal");
const LogicController = require("../controller/logic.controller");
const { JSONCookie } = require("cookie-parser");
const config = require("../config/key");
const { baseDocumentURL } = require("../config/dev");
const { baseImageURL, baseAPIUrl } = require("../config/key");
const animal = require("../validation/animal");
var async = require("async");
const formController = require("./form.controller");
const groupController = require("./group.controller");
const { isForgotTokenActive } = require("./user.controller");
const constant = require("../middleware/constant");

class AnimalController {
  constructor() {}


  async isAnimalAvailableByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      Animal.find({categoryId}).then(result => {
        if(result[0]) resolve(true);
        resolve(false);
      })
    });
  }

  //admin get delete all animals
  
  async getall(req, res) {
    try {
      const animals = await Animal.find({});
      return res
        .status(200)
        .json({ status: 200, message: "All Animals", data: animals.map(e => ({
          ...e.toObject(),
          ...{
            image: e.toObject().image
              ? `${config.baseImageURL}${e.toObject().image}`
              : null,
          },
        })) });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get animals",
        errors: err,
        data: {},
      });
    }
  }
  async deleteall(req, res) {
    try {
      const messages = await Animal.deleteMany({});
      LogicController.deleteallqr();
      return res.status(200).json({
        status: 200,
        message: "All Animals deleted successfully",
        data: messages,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleted Animals",
        errors: err,
        data: {},
      });
    }
  }

  async getQRCodeOfAnimal(req, res, next) {
    try {
      Animal.findById(req.params.id)
        .then((resultAnimal) => {
          return res.status(200).json({
            status: 200,
            message: "All Animals deleted successfully",
            data: {
              ...resultAnimal.toObject(),
              ...{
                qrcodepath: `${baseAPIUrl}${
                  resultAnimal.toObject().qrcodepath
                }`,
              },
            },
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error occurs",
          });
        });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Error in Finding QR Code",
        errors: err,
        data: {},
      });
    }
  }

  //get specific animal  by id
  async getanimal(req, res) {
    try {
      const ea = await Animal.findOne({ _id: req.params.id })
        .populate("family.parent1")
        .populate("family.parent2")
        .populate("family.children")
        .populate("healthRecord.addedBy")
        .populate("categoryId");

      Animal.populate(ea, { path: "categoryId.parentId" }, (err, e) => {
        console.log(e);
        if (e == "") {
          return res.json({
            status: 400,
            message: "Invalid animal Id",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Animal data",
          data: {
            ...e.toObject(),
            ...{
              image: e.toObject().image
                ? `${config.baseImageURL}${e.toObject().image}`
                : null,
            },
            ...{
              qrcodepath: e.toObject().qrcodepath
                ? `${config.Server}/${e.toObject().qrcodepath}`
                : null,
            },
            ...{
              healthRecord: e.toObject().healthRecord.map((hr) => ({
                ...hr,
                ...{ filename: `${baseDocumentURL}${hr.filename}` },
              })),
            },
            ...{
              gallery: e.toObject().gallery.map((img) => ({
                ...img,
                ...{ filename: `${baseImageURL}${img.filename}` },
              })),
            },

            ...{
              family: {
                ...e.toObject().family,
                ...{
                  children: e.toObject().family.children.map((img) => ({
                    ...img,
                    ...{
                      image: img.image ? `${baseImageURL}${img.image}` : null,
                    },
                  })),
                },
                // ...{parent2: e.toObject().family.parent2,
                //    ...{image:  e.toObject().family.parent2 ? `${config.baseImageURL}${e.toObject().family.parent2.image}`: null}
                //   },

                // ...{
                //   parent2: {
                //     ...e.toObject().family.parent2,
                //     ...{
                //       image:
                //         e.toObject().family.parent2 &&
                //         `${config.baseImageURL}${
                //           e.toObject().family.parent2.image
                //         }`,
                //     },
                //   },
                // },
                // ...{
                //   parent1: {
                //     ...e.toObject().family.parent1,
                //     ...{
                //       image:
                //         e.toObject().family.parent1 &&
                //         `${config.baseImageURL}${
                //           e.toObject().family.parent1.image
                //         }`,
                //     },
                //   },
                // },
                



                ...{
                  parent2: (e.toObject().family.parent2 && e.toObject().family.parent2[0]) ? {
                    0: {
                      ...e.toObject().family.parent2[0],
                      image:  `${config.baseImageURL}${
                        e.toObject().family.parent2[0].image
                      }`
                    }, 
                    ...{
                      image:
                        e.toObject().family.parent2 &&
                        `${config.baseImageURL}${
                          e.toObject().family.parent2[0].image
                        }`,
                    },
                  } : {},
                },
                ...{
                  parent1:  (e.toObject().family.parent1 && e.toObject().family.parent1[0]) ? {
                    0: {
                      ...e.toObject().family.parent1[0],
                      image:  `${config.baseImageURL}${
                        e.toObject().family.parent1[0].image
                      }`
                    }, 
                    ...{
                      image:
                        e.toObject().family.parent1 &&
                        `${config.baseImageURL}${
                          e.toObject().family.parent1[0].image
                        }`,
                    },
                  }: {},
                },
         




              },
            },
          },
        });
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get animal",
        errors: err,
        data: {},
      });
    }
  }

  //only breeder owner and admin can delete animal
  async deleteanimal(req, res) {
    try {
      console.log('delete animal');
      groupController.isAnimalAvailable(req.params.id).then(async resultGroup => {
        console.log(resultGroup);
          if(resultGroup)  return res.json({
            status: 400,
            message: "Can not remove! Animal is assign to group.",
            data: {},
          });
          const data = await Animal.findOne({ _id: req.params.id });
           
            // await LogicController.deleteqr(data, data, (nextRes) => {
            //   console.log(nextRes);
            // });
            // // await LogicController.delete
            // const animal = await Animal.deleteOne({
            //   _id: req.params.id,
            //   ...req.user.role.includes('admin') ? {}: {breederId: req.user._id},
            // });
            data.isArchived = true;
            data.save().then(() => {
              return res.status(200).json({
                status: 200,
                message: "Animal deleted successfully",
                data: animal,
              });
            })

      });

      
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in delete Animal",
        errors: err,
        data: {},
      });
    }
  }
  //only breeder owner and admin can update animal
  async updateanimal(req, res) {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    req.body.data = JSON.parse(req.body.data);
    req.body.quantity = req.body.data.quantity;
    req.body.aliveQuantity = req.body.data.quantity;
    req.body.healthyQuantity = req.body.data.quantity;
    try {
      await Animal.updateOne({ _id: req.params.id }, req.body);
      const e = await Animal.findOne({ _id: req.params.id })
        .populate("family.parent1")
        .populate("family.parent2")
        .populate("family.children", "_id status data.name data.sex image")
        .populate("healthRecord.addedBy");
      if (e == "") {
        return res.json({
          status: 400,
          message: "Invalid animal Id",
          data: {},
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Animal Profile Updated Successfully",
        data: {
          ...e.toObject(),
          ...{
            image: e.toObject().image
              ? `${config.baseImageURL}${e.toObject().image}`
              : null,
          },
          ...{
            qrcodepath: e.toObject().qrcodepath
              ? `${config.Server}/${e.toObject().qrcodepath}`
              : null,
          },
          ...{
            healthRecord: e.toObject().healthRecord.map((hr) => ({
              ...hr,
              ...{ filename: `${baseDocumentURL}${hr.filename}` },
            })),
          },
          ...{
            gallery: e.toObject().gallery.map((img) => ({
              ...img,
              ...{ filename: `${baseImageURL}${img.filename}` },
            })),
          },

          ...{
            family: {
              ...e.toObject().family,
              ...{
                children: e.toObject().family.children.map((img) => ({
                  ...img,
                  ...{ image: `${baseImageURL}${img.image}` },
                })),
              },
              // ...{parent2: e.toObject().family.parent2,
              //    ...{image:  e.toObject().family.parent2 ? `${config.baseImageURL}${e.toObject().family.parent2.image}`: null}
              //   },


              // ...{
              //   parent2: {
              //     ...e.toObject().family.parent2,
              //     ...{
              //       image:
              //         e.toObject().family.parent2 &&
              //         `${config.baseImageURL}${
              //           e.toObject().family.parent2.image
              //         }`,
              //     },
              //   },
              // },
              // ...{
              //   parent1: {
              //     ...e.toObject().family.parent1,
              //     ...{
              //       image:
              //         e.toObject().family.parent1 &&
              //         `${config.baseImageURL}${
              //           e.toObject().family.parent1.image
              //         }`,
              //     },
              //   },
              // },


              ...{
                parent2: (e.toObject().family.parent2 && e.toObject().family.parent2[0]) ? {
                  0: {
                    ...e.toObject().family.parent2[0],
                    image:  `${config.baseImageURL}${
                      e.toObject().family.parent2[0].image
                    }`
                  }, 
                  ...{
                    image:
                      e.toObject().family.parent2 &&
                      `${config.baseImageURL}${
                        e.toObject().family.parent2[0].image
                      }`,
                  },
                } : {},
              },
              ...{
                parent1:  (e.toObject().family.parent1 && e.toObject().family.parent1[0]) ? {
                  0: {
                    ...e.toObject().family.parent1[0],
                    image:  `${config.baseImageURL}${
                      e.toObject().family.parent1[0].image
                    }`
                  }, 
                  ...{
                    image:
                      e.toObject().family.parent1 &&
                      `${config.baseImageURL}${
                        e.toObject().family.parent1[0].image
                      }`,
                  },
                }: {},
              },
            },
          },
        },
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updated Animal",
        errors: err,
        data: {},
      });
    }
  }

  async updateAnimalData(req, res, next) {
    try {
      Animal.findByIdAndUpdate(req.params.id, req.body)
        .then((responseAnimal) => {
          return res.status(200).json({
            status: 200,
            message: "Animals updated successfully",
            data: responseAnimal,
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in updating animal",
            errors: error,
            data: {},
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async uploadHealthRecord(req, res) {
    try {
      console.log("uploadhealth record");
      console.log(req.body.id);
      console.log(req.file);
      const messages = await Animal.updateOne(
        { _id: req.body.id },
        {
          $push: {
            healthRecord: {
              filename: req.file.filename,
              size: req.file.size,
              type: req.file.mimetype,
              addedBy: req.user._id,
            },
          },
        }
      );
      console.log(messages);
      return res.status(200).json({
        status: 200,
        message: "Animals Health record uploaded successfully",
        data: "",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in uploading health record",
        errors: err,
        data: {},
      });
    }
  }

  async getHealthRecord(req, res, next) {
    try {
      Animal.findById(req.params.id).then((resultAnimal) => {
        return res.status(200).json({
          status: 200,
          message: "Animals Health record fetched successfully",
          data: resultAnimal.healthRecord,
        });
      });
    } catch (err) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in fetching health record",
        errors: err,
        data: {},
      });
    }
  }

  // async downloadFile(req, res ) {

  // }

  async uploadGalleryImage(req, res, next) {
    try {
      console.log("uploadGalleryImage", req.files);
      console.log(req.body.id);

      Animal.updateOne(
        { _id: req.body.id },
        {
          $push: {
            gallery: {
              $each: req.files.map((file) => ({
                filename: file.filename,
                size: file.size,
                addedBy: req.user._id,
                type: file.mimetype,
              })),
            },
          },
        }
      )
        .then((animalResult) => {
          return res.status(200).json({
            status: 200,
            message: "Animals gallery uploaded successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in upload gallary image record",
            errors: err,
            data: {},
          });
        });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in upload gallary image record",
        errors: err,
        data: {},
      });
    }
  }

  async deleteGallaryImage(req, res, next) {
    try {
      // id, animals,
      console.log("delete gallery image");
      console.log(req.body);
      Animal.findById(req.body.id).then((animaldata) => {
        animaldata.gallery = animaldata.gallery.filter(
          (e) => !req.body.animals.includes(e._id.toString())
        );
        console.log(animaldata);
        animaldata.save().then((_) => {
          return res.status(200).json({
            status: 200,
            message: "Images deleted successfully",
          });
        });
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in deleting gallary image record",
        errors: err,
        data: {},
      });
    }
  }

  async getBreederAnimals(req, res) {
    console.log("====>>", req.user.role === "employee");
    var query = {};
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    query.breederId = { $in: breederId };
    const {activationType} = req.query;
    if(activationType) {
      if(!(activationType==="Both")) {
        console.log ('working');
        query.isArchived = req.query.activationType==='Active' ? false : true;
      }
    }

    console.log(query)
    try {
      //const animals = await Animal.find({ breederId });
      if (req.user.role == "employee") {
        //console.log("====>>here",req.user.breederId )
        const animals = await Animal.find({
          ...{
            ...query,
            breederId: req.user.breederId,
            //...{ farmId: { $in: req.user.farmId } },
          },
          ...(req.query.featured ? { featured: req.query.featured } : {}),
        })
          .sort({ createdAt: -1 })
          .populate("addedBy", "_id name");
        return res.status(200).json({
          status: 200,
          message: "Animal data",
          data: animals.map((e) => ({
            ...e.toObject(),
            ...{
              image: e.toObject().image
                ? `${config.baseImageURL}${e.toObject().image}`
                : null,
            },
            ...{
              qrcodepath: e.toObject().qrcodepath
                ? `${config.Server}/${e.toObject().qrcodepath}`
                : null,
            },
            ...{
              family: {
                ...e.toObject().family,
                parent1: e.toObject().family.parent1
                  ? `${config.Server}/${e.toObject().family.parent1}`
                  : null,
                parent2: e.toObject().family.parent2
                  ? `${config.Server}/${e.toObject().family.parent2}`
                  : null,
              },
            },
          })),
        });
      } else {
        const animals = await Animal.find({...query,
          ...(req.query.featured ? { featured: req.query.featured } : {}),
        })
        .sort({ createdAt: -1 })
          .populate("addedBy")
          .populate("categoryId");
        Animal.populate(
          animals,
          { path: "categoryId.parentId" },
          (err, resultAnimal) => {
            return res.status(200).json({
              status: 200,
              message: "Animal data",
              data: resultAnimal.map((e) => ({
                ...e.toObject(),
                ...{
                  image: e.toObject().image
                    ? `${config.baseImageURL}${e.toObject().image}`
                    : null,
                },
                ...{
                  qrcodepath: e.toObject().qrcodepath
                    ? `${config.Server}/${e.toObject().qrcodepath}`
                    : null,
                },
              })),
            });
          }
        );
      }
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get animal",
        errors: err,
        data: {},
      });
    }
  }

  // For Inventory
  async getAnimalForInventory(breederId) {
    return new Promise(async (resolve, reject) => {
      await Animal.find({ breederId }).then(resolve).catch(reject);
    });
  }

  //get delete animal of specific breeder
  // async getBreederAnimals(req, res) {

  //    ///////filters
  //    let {name,date,categoryName,status,price}=req.query
  //    var query = {};
  //    if ( req.query.hasOwnProperty('name')  && name != '')
  //      {name=new RegExp("^"+ name);
  //      query.name = { "$in": name};}
  //    if ( req.query.hasOwnProperty('status') && status != '')
  //      query.status = { "$in": status};
  //    if ( req.query.hasOwnProperty('categoryName') && categoryName != '')
  //      {categoryName=new RegExp("^"+ categoryName);
  //      query.categoryName = { "$in": categoryName};}
  //    if ( req.query.hasOwnProperty('date') && date != '')
  //      query.createdAt = { "$gte": date};
  //    if ( req.query.hasOwnProperty('price') && price != '')
  //      query.price = { "$gte": price};
  //    //////
  //    const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
  //    query.breederId = { "$in": breederId};
  //   //console.log(query)
  //   try {
  //     //const animals = await Animal.find({ breederId });
  //     if(req.user.role == 'employee') {
  //       const animals = await Animal.find({...query, ...{farmId: {"$in": req.user.farmId}}});
  //       return res.status(200).json({ status: 200, message: "Animal data", data: animals });
  //     } else {
  //       const animals = await Animal.find(query)
  //       return res.status(200).json({ status: 200, message: "Animal data", data: animals });
  //     }
  //   } catch (err) {
  //     return res.json({ status: 400, message: "Error in get animal", errors: err, data: {} });
  //   }
  // }

  async deleteBreederAnimals(req, res) {
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    try {
      const messages = await Animal.deleteMany({ breederId });
      return res.status(200).json({
        status: 200,
        message: "All breeder Animals deleted successfully",
        data: messages,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleted Animals",
        errors: err,
        data: {},
      });
    }
  }

  async deleteAnimal(req, res, next) {
    const breederId = req.user._id;
    try {
      Animal.deleteOne({ _id: req.params.id, breederId })
        .then((deleteResult) => {
          return res
            .status(200)
            .json({ status: 200, message: "Animal deleted successfully" });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in deleting Animal",
            errors: err,
            data: {},
          });
        });
    } catch (err) {
      return next(err);
    }
  }

  async deleteAnimalHealthRecord(req, res, next) {
    try {
      Animal.findById(req.params.animalId)
        .then((resultAnimal) => {
          resultAnimal.healthRecord = resultAnimal.healthRecord.filter(
            (e) => !(e._id == req.params.id)
          );
          console.log(req.params.id);
          console.log("delete animal update");
          console.log(
            resultAnimal.healthRecord.filter((e) => !(e._id == req.params.id))
          );
          resultAnimal.save().then((_) => {
            return res
              .status(200)
              .json({
                status: 200,
                message: "Animal health record deleted successfully",
              });
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in deleting health record",
            errors: err,
            data: {},
          });
        });
    } catch (error) {
      return res.json({
        status: 400,
        message: "Error in deleting health record",
        errors: err,
        data: {},
      });
    }
  }

  async addBreederAnimals(req, res) {
    console.log("add breeder animal works");
    console.log(req.body);
    const { errors, isValid } = validateAnimalInput(req.body);
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }

    try {
      req.body.breederId =
        req.user.role == "employee" ? req.user.breederId : req.user._id;
      req.body.addedBy = req.user._id;
      const data = JSON.parse(req.body.data);
      req.body.image = req.file ? req.file.filename : null;
      req.body.data = JSON.parse(req.body.data);
      req.body.data.quantity;
      req.body.quantity = data.quantity;
      req.body.aliveQuantity = data.quantity;
      req.body.healthyQuantity = data.quantity;
      req.body.family = JSON.parse(req.body.family);
      console.log(req.body);
      const animal = await new Animal(req.body);
      const doc = await animal.save();
      return res.status(200).json({
        status: 200,
        message: "Animals created successfully",
        data: doc,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in creating Animal",
        errors: err,
        data: {},
      });
    }
  }

  async updateAnimalAfterSale(animalArr, buyer, seller) {
    // animalId, price, quantity
    return new Promise((resolve, reject) => {
      
      async
        .eachSeries(animalArr, function updateObj(obj, done) {
          console.log('Calling each series ... ');
          Animal.updateOne({_id: obj.animalId}, {$inc: {aliveQuantity: -obj.quantity, 'data.quantity': -obj.quantity, healthyQuantity: -obj.quantity, soldQuantityPending: obj.quantity}}).then(resultDone => {
            console.log(resultDone);
            console.log('This is done condition ... ');
            done();
          }).catch(error => {
            console.log('this is error condition... ');
            console.log(error);
            done();
          });
        })
        .then((alldone) => {
          console.log("all done");
          resolve(true);
        })
        .catch((error) => {
          console.log("Error ");
          console.log(error);
          reject();
        });
    });
  }



  async transferAnimal(req, res, next) {
    try {
      const {animalId, quantity,  buyerId, sellerId, breederId } = req.body;
      Animal.findById(animalId).then(animalResult => {
        console.log(animalResult);
        console.log(' ==== > animal result');
        const isBuyerAvailable = animalResult.buyer
          .map((e) => e.id)
          .includes(buyerId) || animalResult.transferBreeder.map((e) => e.id).includes(buyerId);
        console.log('This is is buyer available : ', isBuyerAvailable);
        animalResult.aliveQuantity = parseInt(animalResult.aliveQuantity) - parseInt(quantity);
        animalResult.healthyQuantity =
          parseInt(animalResult.healthyQuantity) - parseInt(quantity);
        animalResult.data.quantity =
          parseInt(animalResult.data.quantity) - parseInt(quantity);
        animalResult.transferQuantity =
          parseInt(animalResult.transferQuantity) + parseInt(quantity);
        animalResult.transferBreeder = [
          ...animalResult.transferBreeder,
          ...[{ id: buyerId, quantity: quantity, date: new Date() }],
        ];
        animalResult.save((_) => {
          animalResult = animalResult.toObject();
          const currentSellerAnimalId = animalResult._id;
          delete animalResult._id;
          delete animalResult.transferBreeder;
          if(isBuyerAvailable) {
            Animal.findOne({ sellerAnimalId: animalId, breederId: buyerId }).then(
              (partnerAnimal) => {


                console.log('partner animal===> ');
                console.log(partnerAnimal);
                partnerAnimal.aliveQuantity =
                  parseInt(partnerAnimal.aliveQuantity) +
                  parseInt(quantity);
                partnerAnimal.healthyQuantity =
                  parseInt(partnerAnimal.healthyQuantity) +
                  parseInt(quantity);
                partnerAnimal.data.quantity =
                  parseInt(partnerAnimal.data.quantity) +
                  parseInt(quantity);
                partnerAnimal.transferBreederReceived = [
                  ...partnerAnimal.transferBreederReceived,
                  ...[
                    {
                      id: sellerId,
                      quantity: quantity,
                      date: new Date(),
                    },
                  ],
                ];
                partnerAnimal.save().then((_) => {
                  formController
                    .addBreederInForm(
                      buyerId,
                      animalResult.categoryId,
                      sellerId
                    )
                    .then((all_done) => {
                      return res.status(200).json({
                        status: 200,
                        message: "Animals transfered successfully",
                      });
                    });
                });

              });
          } else {
            console.log(animalResult);
            const newAnimal = new Animal({
              ...animalResult,
              buyer: [],
              breederId: buyerId,
              aliveQuantity: parseInt(quantity),
              soldQuantity: 0,
              deadQuantity: 0,
              healthyQuantity: parseInt(quantity),
              sickQuantity: 0,
              pregnantQuantity: 0,
              sellerAnimalId: currentSellerAnimalId,
              seller: [],
              transferBreederReceived: [
                { id: sellerId, quantity: quantity, date: new Date() },
              ]
            });
            newAnimal.save().then((_) => {
              formController
                .addBreederInForm(buyerId, animalResult.categoryId, sellerId)
                .then(_ => {
                  return res.status(200).json({
                    status: 200,
                    message: "Animals transfered successfully",
                  });
                });
            });
          }

        });
    
      })
    } catch(error) {
      return res.json({
        status: 400,
        message: "Error in transfer animal",
        errors: error,
        data: {},
      });
    }
  }


  async updateAnimalAfterPaid(animalArr, buyer, seller) {
    // animalId, price, quantity
    return new Promise((resolve, reject) => {
      console.log(
        "Updating animal ",
        animalArr.map((e) => e.animalId)
      );

      async
        .eachSeries(animalArr, function updateObj(obj, done) {
          Animal.findById(obj.animalId).then((animalResult) => {
            console.log(animalResult);
            console.log(' ==== > animal result');
            console.log(obj)
            const isBuyerAvailable = animalResult.buyer
              .map((e) => e.id)
              .includes(buyer);
            animalResult.aliveQuantity =
              parseInt(animalResult.aliveQuantity) - parseInt(obj.quantity);
            animalResult.healthyQuantity =
              parseInt(animalResult.healthyQuantity) - parseInt(obj.quantity);
            animalResult.soldQuantity =
              parseInt(animalResult.soldQuantity) + parseInt(obj.quantity);
            animalResult.buyer = [
              ...animalResult.buyer,
              ...[{ id: buyer, quantity: obj.quantity, date: new Date() }],
            ];
            animalResult.save((_) => {
              animalResult = animalResult.toObject();
              const currentSellerAnimalId = animalResult._id;
              delete animalResult._id;
              if (isBuyerAvailable) {
                Animal.findOne({ sellerAnimalId: obj.animalId, breederId: seller }).then(
                  (partnerAnimal) => {
                    console.log('partner animal===> ');
                    console.log(partnerAnimal);
                    partnerAnimal.aliveQuantity =
                      parseInt(partnerAnimal.aliveQuantity) +
                      parseInt(obj.quantity);
                    partnerAnimal.healthyQuantity =
                      parseInt(partnerAnimal.healthyQuantity) +
                      parseInt(obj.quantity);
                    partnerAnimal.seller = [
                      ...partnerAnimal.seller,
                      ...[
                        {
                          id: seller,
                          quantity: obj.quantity,
                          date: new Date(),
                        },
                      ],
                    ];
                    partnerAnimal.save().then((_) => {
                      formController
                        .addBreederInForm(
                          buyer,
                          animalResult.categoryId,
                          seller
                        )
                        .then(done);
                    });
                  }
                );
              } else {
                console.log(animalResult);
                const newAnimal = new Animal({
                  ...animalResult,
                  buyer: [],
                  breederId: buyer,
                  aliveQuantity: parseInt(obj.quantity),
                  soldQuantity: 0,
                  deadQuantity: 0,
                  healthyQuantity: parseInt(obj.quantity),
                  sickQuantity: 0,
                  pregnantQuantity: 0,
                  sellerAnimalId: currentSellerAnimalId,
                  seller: [
                    { id: seller, quantity: obj.quantity, date: new Date() },
                  ],
                });
                newAnimal.save().then((_) => {
                  formController
                    .addBreederInForm(buyer, animalResult.categoryId, seller)
                    .then(done);
                });
              }
            });
          });

          // Animal.update({_id: obj.animalId}, {$inc: {aliveQuantity: parseInt(obj.quantity)*-1, soldQuantity: parseInt(obj.quantity)}}).then(_ => {

          // })
        })
        .then((alldone) => {
          console.log("all done");
          resolve(true);
        })
        .catch((error) => {
          console.log("Error ");
          console.log(error);
          reject();
        });
      // Animal.updateMany(
      //   { _id: { $in: animalArr.map((e) => e.animalId) } },
      //   {
      //     $set: {
      //       status: "sold",
      //       buyer,
      //       seller,
      //       // Shift animal to new breeder..
      //       breederId: buyer
      //     } ,
      //     $inc: {
      //       aliveQuantity:
      //       soldQuantity
      //     },

      //   }
      // ).then((result) => {
      //   resolve(result);
      // });
    });
  }

  async removeAnimalParent(req, res) {
    try {
      let parent = "";
      console.log(req.params.id);
      console.log(req.params.parentName);
      Animal.findById(req.params.id).then((animalResult) => {
        parent = animalResult.family[req.params.parentName].id;
        animalResult.family[req.params.parentName] = {};
        animalResult.save().then((_) => {
          Animal.findById(parent).then((parentResult) => {
            parentResult.family["children"] = parentResult.family[
              "children"
            ].filter((e) => !(e == req.params.id));
            parentResult.save();
            return res.status(200).json({
              status: 200,
              message: "Parent Deleted successfully",
            });
          });
        });
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Animal",
        errors: err,
        data: {},
      });
    }
  }

  async removeAnimalChild(req, res) {
    try {
      let child = "";
      console.log(req.params.id);
      console.log(req.params.childId);
      Animal.findById(req.params.id).then((animalResult) => {
        // child = animalResult.family['children'].filter(e => e==req.params.childId);
        animalResult.family["children"] = animalResult.family[
          "children"
        ].filter((e) => !(e == req.params.childId));
        animalResult.save().then((_) => {
          Animal.findById(req.params.childId).then((childResult) => {
            if (childResult.family["parent1"].id == req.params.id) {
              childResult.family["parent1"] = {};
            } else if (childResult.family["parent2"].id == req.params.id) {
              childResult.family["parent2"] = {};
            }
            console.log(childResult.family);
            childResult.save();
            return res.status(200).json({
              status: 200,
              message: "Parent Deleted successfully",
            });
          });
        });
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Animal",
        errors: err,
        data: {},
      });
    }
  }

  async addAnimalAsParentChild(req, res) {
    try {
      const { type } = req.body;
      console.log(req.body.type);
      console.log(req.body.id);
      console.log(req.body.animalId);
      Animal.findById(req.body.id).then((animalResult) => {
        if (type === "parent1") {
          animalResult.family["parent1"] = { id: req.body.animalId };
        } else if (type === "parent2") {
          animalResult.family["parent2"] = { id: req.body.animalId };
        } else {
          animalResult.family.children = [
            ...animalResult.family.children,
            ...[req.body.animalId],
          ];
        }
        Animal.findById(req.body.animalId).then((parentChildAnimal) => {
          if (type === "parent1" || type === "parent2") {
            parentChildAnimal.family["children"] = [
              ...parentChildAnimal.family["children"],
              ...[req.body.id],
            ];
            console.log(parentChildAnimal.family["children"]);
            animalResult.save().then((_) => {
              parentChildAnimal.save().then((_) => {
                return res.status(200).json({
                  status: 200,
                  message: "Animal added successfully",
                });
              });
            });
          } else {
            if (
              parentChildAnimal.family["parent1"].id &&
              parentChildAnimal.family["parent2"].id
            ) {
              console.log("in if condition");
              console.log(parentChildAnimal.family["parent1"]);
              return res.json({
                status: 400,
                message: "You can not be the parent of this animal.",
                // errors: err,
                data: {},
              });
            } else {
              if (!parentChildAnimal.family["parent1"].id) {
                parentChildAnimal.family["parent1"] = { id: req.body.id };
              } else {
                parentChildAnimal.family["parent2"] = { id: req.body.id };
              }
              animalResult.save().then((_) => {
                parentChildAnimal.save().then((_) => {
                  return res.status(200).json({
                    status: 200,
                    message: "Animal added successfully",
                  });
                });
              });
            }
          }
        });
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in adding Animal",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new AnimalController();
