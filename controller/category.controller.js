const { Category } = require("../models/Animal/Category");
const { Animal } = require("../models/Animal/Animal");
const { Product } = require("../models/Product");
const { Form } = require("../models/Form/Form");

const { restart } = require("nodemon");
const { imageURL, baseImageURL } = require("../config/dev");
const productController = require("./product.controller");
const animalController = require("./animal.controller");
const formController = require("./form.controller");
const { removeQuote } = require("../middleware/constant");
class CategoryController {
  constructor() {
    this.getInventoryByBreeder = this.getInventoryByBreeder.bind(this);
    this.deletebyId = this.deletebyId.bind(this);
  }







  //only admin
  async create(req, res) {
    const { name, active, parentId, type, icon, breeds } = req.body;
    console.log(req.body);
    console.log(name);
    if (!name) {
      return res.json({
        status: 400,
        message: "Name is required",
        errors: { name: "Name is required" },
        data: {},
      });
    }
    try {
      Category.find({name, addedBy: req.user._id}).then(async (resultCategoryExist) => {
        console.log(resultCategoryExist);
        if(resultCategoryExist[0]) return res.json({
          status: 400,
          message: "Category already exist!",
          data: {},
        });
        if(req.body.type === 'animal') {
          req.body.breeds = JSON.parse(req.body.breeds);
          req.body.traits = JSON.parse(req.body.traits);
        } else if(req.body.type === 'product') {
          req.body.subCategories = JSON.parse(req.body.subCategories);
        }
        console.log(req.body );
        const animal = await new Category({
          ...req.body,
          icon: req.file ? req.file.filename : null,
          // name,
          // active,
          // type,
          // parentId: parentId ? parentId : null,
          // icon: icon ? icon : null,
          // // breeds: breeds ? breeds.map(e => ({name: e, value: e.replace(/[\s,-]/g, "")})) : [],
          // breeds: breeds ? breeds : [],
          addedBy: req.user._id,
        });
        const doc = await animal.save();
        return res
          .status(200)
          .json({
            status: 200,
            message: "Category created successfully",
            data: doc,
          });
      })
  
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in creating Category",
        errors: err,
        data: {},
      });
    }
  }

  async getall(req, res) {
    const breederId =req.user.role == "employee" ? req.user.breederId : req.user._id;
    try {
      console.log("getting categories");
      const category = await Category.find({
        ...req.query.type ? { type: req.query.type } : {},
        ...(req.query.type==='animalproduct') ? {type: {$in: ['animal', 'product']}}: {},
        ...(req.query.type==="contact" || req.query.type==="activity") ? {addedBy: breederId}: {},
        }
      ).sort({ createdAt: -1 })
      //removed (.populate("parentId");)
      return res
        .status(200)
        .json({
          status: 200,
          message: "All Categories",
          data: category.map((e) => ({
            ...e.toObject(),
            ...{ icon: `${baseImageURL}form/${e.toObject().icon}` },
          })),
        });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in get Categories",
        errors: err,
        data: {},
      });
    }
  }

  async allCategories(type) {
    return new Promise((resolve, reject) => {
      Category.find(req.query.type ? { type } : {})
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  async deleteall(req, res) {
    try {
      const category = await Category.deleteMany({});
      return res
        .status(200)
        .json({
          status: 200,
          message: "All Categories deleted successfully",
          data: category,
        });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Category",
        errors: err,
        data: {},
      });
    }
  }

  async getbyId(req, res) {
    try {
      const category = await Category.find({ _id: req.params.id });
      if (category == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Category", data: category });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Category",
        errors: err,
        data: {},
      });
    }
  }

  async isAnimalAvailableByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      Animal.find({categoryId}).then(result => {
        if(result[0]) resolve(true);
        resolve(false);
      });
    });
  }

  async isProductAvailableByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      Product.find({categoryId}).then(result => {
        if(result[0]) resolve(true);
        resolve(false);
      })
    });
  }

  async deleteFormByCategoryId(categoryId) {
    return new Promise((resolve, reject) => {
        Form.deleteOne({categoryId}).then(() => {
           resolve(); 
        }).catch((error) => {
            reject(error);
        })
    });
}

  async deletebyId(req, res) {
    try {
      Category.findById(req.params.id).then(async categoryResult => {
        if(categoryResult.type === 'animal') {
          let isAvailable = await this.isAnimalAvailableByCategory(req.params.id);
          console.log('already available animal');
          if(isAvailable)  return res.json({
            status: 400,
            message: "Can not remove! Animal is registered in this category.",
            data: {},
          });
        } else if(categoryResult.type === 'product') {
          let isAvailable = await this.isProductAvailableByCategory(req.params.id);
          console.log('already available product');
          if(isAvailable)  return res.json({
            status: 400,
            message: "Can not remove! Product is registered in this category.",
            data: {},
          });
        }
        console.log('then called delete !!!');
        const category = await Category.deleteOne({ _id: req.params.id });
        const form = await this.deleteFormByCategoryId(req.params.id).catch(error => {
          console.log(error);
        });
          
        return res
          .status(200)
          .json({
            status: 200,
            message: "Category deleted successfully",
            data: category,
          });
      });

     

      // animalController.isAnimalAvailableByCategory(req.params.id).then(isAvailable => {
      //   if(isAvailable)  return res.json({
      //     status: 400,
      //     message: "Can not remove! Animal is registered in this category.",
      //     data: {},
      //   });
       
      // })
     
    } catch (err) {
      console.log (err);
      return res.json({
        status: 400,
        message: "Error in deleting Category",
        errors: err,
        data: {},
      });
    }
  }


  async updateCategoryById(req, res) {
   
  
    try {
      // if(req.body.type === 'animal') {
      //   req.body.breeds = JSON.parse(req.body.breeds);
      //   req.body.traits = JSON.parse(req.body.traits);
      // } else if(req.body.type === 'product') {
      //   req.body.subCategories = JSON.parse(req.body.subCategories);
      // }
      req.body.data = JSON.parse(req.body.data);
      const category = await Category.updateOne(
        { _id: req.params.id },
        {...req.body.data, ...req.file ? {icon: req.file.filename} : {}},
      );

      return res
        .status(200)
        .json({
          status: 200,
          message: "Category updated successfully",
          data: category,
        });
    
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Category",
        errors: err,
        data: {},
      });
    }
  }


  async updatebyId(req, res) {
    const { name, active } = req.body;
    if (!name) {
      return res.json({ status: 400, message: "name required", data: {} });
    }
    try {
      Category.find({name, addedBy: req.user._id}).then(async (resultCategoryExist) => {
        console.log(resultCategoryExist);
        if(resultCategoryExist[0]) return res.json({
          status: 400,
          message: "Category already exist!",
          data: {},
        });
        const category = await Category.updateOne(
          { _id: req.params.id },
          { name, active }
        );
  
        return res
          .status(200)
          .json({
            status: 200,
            message: "Category updated successfully",
            data: category,
          });
      });
    
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Category",
        errors: err,
        data: {},
      });
    }
  }

  async getCategoryByIdAndFindParent(_id) {
    return await Category.find()
      .then((res) => {
        console.log("filter category");
        return res.filter((e) => e.parentId == _id)[0]
          ? { error: true, message: "This is parent category" }
          : res;
      })
      .then((res) => {
        if (res.error) return res;

        return res.filter((e) => e._id == _id)[0]
          ? { error: false, message: "" }
          : { error: true, message: "Category is not available" };
      });
  }


  async getAnimalForInventory(breederId) {
    return new Promise(async (resolve, reject) => {
      await Animal.find({ breederId }).then(resolve).catch(reject);
    });
  }
  async getProductForInventory(breederId) {
    return new Promise(async (resolve, reject) => {
      await Product.find({breederId}).then(resolve).catch(reject);
    });
  }
  // Inventory Section.....
  // ##########################################################################

//   async getInventoryByBreeder(req, res, next) {
//     try {
//       console.log ('inventory breeder');
//       const { breederId } = req.params;
//       const {type} = req.query;
//       let match;
     
//       if(type === 'animal') {
//         console.log('animal inventory finding');
//         match = await this.getAnimalForInventory(breederId);
//         // console.log(animalResult.map(e => e.categoryId));
//       } else {
//         match = await this.getProductForInventory(breederId);
//       }

//       // const categoryReducer  = (acc, currValue) => {
//       //   currValue.items = currValue.items.map(e => {
//       //     const status = {
//       //       alive: match.reduce((a, cv)=> (cv.status==='Alive') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//       //       sold: match.reduce((a, cv)=> (cv.status==='Sold') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//       //       died: match.reduce((a, cv)=> (cv.healthStatus==='Died') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//       //       pregnant: match.reduce((a, cv)=> (cv.healthStatus==='Pregnant') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//       //     }
//       //     return {
//       //     ...e,
//       //     ...status,
//       //     total: status.alive + status.sold
//       //   }
//       //   })

//       //   return [...acc, 
//       //     {
//       //       ...currValue, 
//       //       total: currValue.items.reduce((a, cv) => a+cv.total,0),
//       //       alive: currValue.items.reduce((a, cv) => a+cv.alive, 0),
//       //       sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
//       //       died: currValue.items.reduce((a, cv) => a+cv.died, 0),
//       //       pregnant: currValue.items.reduce((a, cv) => a+cv.pregnant, 0),
            
//       //     }];
//       // } 


//       const categoryReducer  = (acc, currValue) => {
//         currValue.items = currValue.items.map(e => {
//           const status = {
//             alive: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.aliveQuantity : a ,0),
//             sold: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.soldQuantity : a ,0),
//             died: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.deadQuantity : a ,0),
//             pregnant: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.pregnantQuantity : a ,0),
//           }
//           return {
//           ...e,
//           ...status,
//           total: status.alive + status.sold
//         }
//         })

//         return [...acc, 
//           {
//             ...currValue, 
//             total: currValue.items.reduce((a, cv) => a+cv.total,0),
//             alive: currValue.items.reduce((a, cv) => a+cv.alive, 0),
//             sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
//             died: currValue.items.reduce((a, cv) => a+cv.died, 0),
//             pregnant: currValue.items.reduce((a, cv) => a+cv.pregnant, 0),
            
//           }];
//       } 


//       const productReducer = (acc, currValue) => {
//         currValue.items = currValue.items.map(e => {
//           const status = {
//             alive: match.reduce((a, cv)=> (cv.status==='Alive') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//             sold: match.reduce((a, cv)=> (cv.status==='Sold') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//             died: match.reduce((a, cv)=> (cv.healthStatus==='Died') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//             pregnant: match.reduce((a, cv)=> (cv.healthStatus==='Pregnant') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
//           }
//           return {
//           ...e,
//           ...status,
//           total: status.alive + status.sold
//         }
//         })

//         return [...acc, 
//           {
//             ...currValue, 
//             total: currValue.items.reduce((a, cv) => a+cv.total,0),
//             alive: currValue.items.reduce((a, cv) => a+cv.alive, 0),
//             sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
//             died: currValue.items.reduce((a, cv) => a+cv.died, 0),
//             pregnant: currValue.items.reduce((a, cv) => a+cv.pregnant, 0),
            
//           }];
//       }
// // subCategories: {$addToSet: { id: '$_id', name: '$name', type: '$type', icon: '$icon' }}
// console.log(match.map(e => e.categoryId));
//       Category.aggregate(
//         [
//           {$match: {
//             _id: {$in: match.map(e => e.categoryId) } 
//           }},
//           { $group: { _id: "$_id", category: {$first: '$_id'}, items: {$push : '$$ROOT'} } },
//         ])
//         .exec()
//         .then((result) => {
//           console.log(result);
//           Category.populate(result, {path: "category"}, (err, categoryDoc) => {
//             const finalRes = categoryDoc.reduce((type==='animal') ? categoryReducer : productReducer, [])
//             console.log(finalRes);
//             return res
//               .status(200)
//               .json({
//                 status: 200,
//                 message: "Result found successfully",
//                 data: finalRes,
//               });
//           })
//         })
//         .catch((error) => {
//           console.log(error);
//           return res.json({ status: 400, message: "Error in finding result" });
//         });
//     } catch (error) {
//       return next(error);
//     }
//   }






async getInventoryByBreeder(req, res, next) {
  try {
    console.log ('inventory breeder');
    const { breederId } = req.params;
    const {type} = req.query;
    let match;
   
    if(type === 'animal') {
      console.log('animal inventory finding');
      match = await this.getAnimalForInventory(breederId);
      // console.log(animalResult.map(e => e.categoryId));
    } else {
      match = await this.getProductForInventory(breederId);
    }

    // const categoryReducer  = (acc, currValue) => {
    //   currValue.items = currValue.items.map(e => {
    //     const status = {
    //       alive: match.reduce((a, cv)=> (cv.status==='Alive') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
    //       sold: match.reduce((a, cv)=> (cv.status==='Sold') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
    //       died: match.reduce((a, cv)=> (cv.healthStatus==='Died') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
    //       pregnant: match.reduce((a, cv)=> (cv.healthStatus==='Pregnant') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
    //     }
    //     return {
    //     ...e,
    //     ...status,
    //     total: status.alive + status.sold
    //   }
    //   })

    //   return [...acc, 
    //     {
    //       ...currValue, 
    //       total: currValue.items.reduce((a, cv) => a+cv.total,0),
    //       alive: currValue.items.reduce((a, cv) => a+cv.alive, 0),
    //       sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
    //       died: currValue.items.reduce((a, cv) => a+cv.died, 0),
    //       pregnant: currValue.items.reduce((a, cv) => a+cv.pregnant, 0),
          
    //     }];
    // } 


    const categoryReducer  = (acc, currValue) => {
      currValue.items = currValue.items.map(e => {
        const status = {
          alive: match.reduce((a, cv)=> (cv.data.breed.toString()===e.breed.value.toString()) ? a+cv.aliveQuantity : a ,0),
          sold: match.reduce((a, cv)=> (cv.data.breed.toString()===e.breed.value.toString()) ? a+cv.soldQuantity : a ,0),
          died: match.reduce((a, cv)=> (cv.data.breed.toString()===e.breed.value.toString()) ? a+cv.deadQuantity : a ,0),
          pregnant: match.reduce((a, cv)=> (cv.data.breed.toString()===e.breed.value.toString()) ? a+cv.pregnantQuantity : a ,0),
        }
        return {
        ...e,
        ...status,
        total: status.alive + status.sold
      }
      })

      return [...acc, 
        {
          ...currValue, 
          total: currValue.items.reduce((a, cv) => a+cv.total,0),
          alive: currValue.items.reduce((a, cv) => a+cv.alive, 0),
          sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
          died: currValue.items.reduce((a, cv) => a+cv.died, 0),
          pregnant: currValue.items.reduce((a, cv) => a+cv.pregnant, 0),
          
        }];
    } 

    const productReducer  = (acc, currValue) => {
      currValue.items = currValue.items.map(e => {
        const status = {
          instock: match.reduce((a, cv)=> (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+cv.goodConditionQuantity : a ,0),
          sold: match.reduce((a, cv)=> (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+cv.soldQuantity : a ,0),
          damaged: match.reduce((a, cv)=> (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+cv.damagedQuantity : a ,0),
          expired: match.reduce((a, cv)=> (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+cv.expiredQuantity : a ,0),
        }
        console.log(status);
        return {
        ...e,
        ...status,
        total: status.instock + status.sold
      }
      });

      console.log(currValue.items);

      return [...acc, 
        {
          ...currValue, 
          total: currValue.items.reduce((a, cv) => a+cv.total,0),
          instock: currValue.items.reduce((a, cv) => a+cv.instock, 0),
          sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
          damaged: currValue.items.reduce((a, cv) => a+cv.damaged, 0),
          expired: currValue.items.reduce((a, cv) => a+cv.expired, 0),          
        }];
    } 
    // const productReducer = (acc, currValue) => {
    //   currValue.items = currValue.items.map(e => {
    //     const status = {
    //       alive: match.reduce((a, cv)=> (cv.status==='Alive') && (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+1 : a ,0),
    //       sold: match.reduce((a, cv)=> (cv.status==='Sold') && (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+1 : a ,0),
    //       died: match.reduce((a, cv)=> (cv.healthStatus==='Died') && (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+1 : a ,0),
    //       pregnant: match.reduce((a, cv)=> (cv.healthStatus==='Pregnant') && (cv.data.subCategory.toString()===e.subCategory.value.toString()) ? a+1 : a ,0),
    //     }
    //     return {
    //     ...e,
    //     ...status,
    //     total: status.alive + status.sold
    //   }
    //   })

    //   return [...acc, 
    //     {
    //       ...currValue, 
    //       total: currValue.items.reduce((a, cv) => a+cv.total,0),
    //       alive: currValue.items.reduce((a, cv) => a+cv.alive, 0),
    //       sold: currValue.items.reduce((a, cv) => a+cv.sold, 0),
    //       died: currValue.items.reduce((a, cv) => a+cv.died, 0),
    //       pregnant: currValue.items.reduce((a, cv) => a+cv.pregnant, 0),
          
    //     }];
    // }
// subCategories: {$addToSet: { id: '$_id', name: '$name', type: '$type', icon: '$icon' }}


    Category.find({"breeds.value" : {$in: match.map(e => e.data.breed)}}).then(reusltCategory => {
      console.log('resultcategory ===> ');
      let data = (type === 'animal') ? reusltCategory.map(category => ({...category.toObject(), category: category.toObject(), items: category.toObject().breeds.map(e => ({breed: e, name: e.name})) }))
      : reusltCategory.map(category => ({...category.toObject(), category: category.toObject(), items: category.toObject().subCategories.map(e => ({subCategory: e, name: e.name})) }))
      const finalRes = data.reduce((type==='animal') ? categoryReducer : productReducer, [])
      return res
      .status(200)
      .json({
        status: 200,
        message: "Result found successfully",
        data: finalRes,
      });
    }).catch((error) => {
      console.log(error);
      return res.json({ status: 400, message: "Error in finding result" });
    });



    // Category.aggregate(
    //   [
    //     {$match: {
    //       _id: {$in: match.map(e => e.categoryId) } 
    //     }},
    //     { $group: { _id: "$_id", category: {$first: '$_id'}, items: {$push : '$$ROOT'} } },
    //   ])
    //   .exec()
    //   .then((result) => {
    //     console.log(result);
    //     Category.populate(result, {path: "category"}, (err, categoryDoc) => {
    //       const finalRes = categoryDoc.reduce((type==='animal') ? categoryReducer : productReducer, [])
    //       // console.log(finalRes);
    //       return res
    //         .status(200)
    //         .json({
    //           status: 200,
    //           message: "Result found successfully",
    //           data: finalRes,
    //         });
    //     })
    //   })
     
  } catch (error) {
    return next(error);
  }
}





  // Activity section...
  async addType(req, res, next) {
    try {
      Category.update({_id: req.params.id}, {$push: {subType: req.body.type}}).then(categoryResult => {
        return res
              .status(200)
              .json({
                status: 200,
                message: "Category updated successfully",
                data: categoryResult,
              });
      }).catch((error) => {
        console.log(error);
        return res.json({ status: 400, message: "Error in updating result" });
      });
    }catch(error) {
      console.log(error);
      return next(error);
    }
  }



}

module.exports = new CategoryController();
