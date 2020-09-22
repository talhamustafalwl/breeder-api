const { Animal } = require("../models/Animal/Animal");
const { validateAnimalInput } = require("../validation/animal");
const LogicController = require("../controller/logic.controller");
const { JSONCookie } = require("cookie-parser");
const config = require("../config/key");
const { baseDocumentURL } = require("../config/dev");
const { baseImageURL } = require("../config/key");

class AnimalController {
  constructor() {}

  //admin get delete all animals
  async getall(req, res) {
    try {
      const animals = await Animal.find({});
      return res
        .status(200)
        .json({ status: 200, message: "All Animals", data: animals });
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

  //get specific animal  by id
  async getanimal(req, res) {
    try {
      const e = await Animal.findOne({ _id: req.params.id })
        .populate("family.parent1")
        .populate("family.parent2")
        .populate("family.children","_id status data.name data.sex image")
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
            healthRecord: e
              .toObject()
              .healthRecord.map((hr) => ({
                ...hr,
                ...{ filename: `${baseDocumentURL}${hr.filename}` },
              })),
          },
          ...{
            gallery: e
              .toObject()
              .gallery.map((img) => ({
                ...img,
                ...{ filename: `${baseImageURL}${img.filename}` },
              })),
          },

          ...{
            family: {
              ...e.toObject().family,
              ...{
                children: e.toObject().family
                .children.map((img) => ({
                  ...img,
                  ...{ image: `${baseImageURL}${img.image}` },
                }))
              },
              // ...{parent2: e.toObject().family.parent2,
              //    ...{image:  e.toObject().family.parent2 ? `${config.baseImageURL}${e.toObject().family.parent2.image}`: null}
              //   },

              ...{
                parent2:{...e.toObject().family.parent2,...{image:e.toObject().family.parent2 && `${config.baseImageURL}${e.toObject().family.parent2.image}`}}
                },
                ...{
                  parent1:{...e.toObject().family.parent1,...{image:e.toObject().family.parent1 && `${config.baseImageURL}${e.toObject().family.parent1.image}`}}
                  }
            },   
          }
          
        },
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
      const data = await Animal.findOne({ _id: req.params.id });
      await LogicController.deleteqr(data);
      // await LogicController.delete
      const animal = await Animal.deleteOne({
        _id: req.params.id,
        breederId: req.user._id,
      });
      return res.status(200).json({
        status: 200,
        message: "Animal deleted successfully",
        data: animal,
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
    if(req.file){
    req.body.image = req.file.filename;
    }
    req.body.data = JSON.parse(req.body.data);
    try {
      await Animal.updateOne({ _id: req.params.id }, req.body);
      const e = await Animal.findOne({ _id: req.params.id })
      .populate("family.parent1")
      .populate("family.parent2")
      .populate("family.children","_id status data.name data.sex image")
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
          healthRecord: e
            .toObject()
            .healthRecord.map((hr) => ({
              ...hr,
              ...{ filename: `${baseDocumentURL}${hr.filename}` },
            })),
        },
        ...{
          gallery: e
            .toObject()
            .gallery.map((img) => ({
              ...img,
              ...{ filename: `${baseImageURL}${img.filename}` },
            })),
        },

        ...{
          family: {
            ...e.toObject().family,
            ...{
              children: e.toObject().family
              .children.map((img) => ({
                ...img,
                ...{ image: `${baseImageURL}${img.image}` },
              }))
            },
            // ...{parent2: e.toObject().family.parent2,
            //    ...{image:  e.toObject().family.parent2 ? `${config.baseImageURL}${e.toObject().family.parent2.image}`: null}
            //   },

            ...{
              parent2:{...e.toObject().family.parent2,...{image:e.toObject().family.parent2 && `${config.baseImageURL}${e.toObject().family.parent2.image}`}}
              },
              ...{
                parent1:{...e.toObject().family.parent1,...{image:e.toObject().family.parent1 && `${config.baseImageURL}${e.toObject().family.parent1.image}`}}
                }
          },   
        }
        
      },
    })
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
      Animal.updateOne({ _id: req.params.id }, req.body).then(responseAnimal  => {
        return res.status(200).json({
          status: 200,
          message: "Animals updated successfully",
          data: "",
        });
      }).catch(error => {
        return res.json({
          status: 400,
          message: "Error in updating animal",
          errors: error,
          data: {},
        });
      });

    } catch(error ) {
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
      console.log("uploadGalleryImage",req.files);
      console.log(req.body.id);

      Animal.updateOne({_id: req.body.id}, {$push: {gallery: {$each: req.files.map(file => ({filename: file.filename, size: file.size, addedBy: req.user._id}))} }}).then(animalResult => {
        return res.status(200).json({
          status: 200,
          message: "Animals gallery uploaded successfully",
        });
      }).catch(error => {
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

  async deleteGallaryImage(req, res,next) {
    try {
      // id, animals, 
      console.log('delete gallery image');
      console.log(req.body);
      Animal.findById(req.body.id).then(animaldata => {
        animaldata.gallery = animaldata.gallery.filter(e => !req.body.animals.includes(e._id.toString()));
        console.log(animaldata);
        animaldata.save().then(_ => {
          return res.status(200).json({
            status: 200,
            message: "Animals gallery images deleted successfully",
          });
        });
      })
    } catch(error) {
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
    console.log("====>>",req.user.role=== "employee" )
    var query = {};
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    query.breederId = { $in: breederId };
    //console.log(query)
    try {
      //const animals = await Animal.find({ breederId });
      if (req.user.role == "employee") {
        //console.log("====>>here",req.user.breederId )
        const animals = await Animal.find({
          ...query,
          breederId:req.user.breederId
          //...{ farmId: { $in: req.user.farmId } },
        });
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
          })),
        });
      } else {
        const animals = await Animal.find(query).populate("addedBy");
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
          })),
        });
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
      req.body.image = req.file.filename;
      req.body.data = JSON.parse(req.body.data);
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
      return res.json({
        status: 400,
        message: "Error in creating Animal",
        errors: err,
        data: {},
      });
    }
  }

  async updateAnimalAfterSale(animalArr, buyer, seller) {
    return new Promise((resolve, reject) => {
      console.log(
        "Updating animal ",
        animalArr.map((e) => e.animalId)
      );
      Animal.updateMany(
        { _id: { $in: animalArr.map((e) => e.animalId) } },
        { $set: { status: "sold", buyer, seller } }
      ).then((result) => {
        resolve(result);
      });
    });
  }
}

module.exports = new AnimalController();
