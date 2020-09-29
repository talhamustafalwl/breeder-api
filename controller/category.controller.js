const { Category } = require("../models/Animal/Category");
const { restart } = require("nodemon");
const { imageURL, baseImageURL } = require("../config/dev");
const animalController = require("./animal.controller");
const productController = require("./product.controller");
class CategoryController {
  constructor() {}

  //only admin
  async create(req, res) {
    const { name, active, parentId, type, icon } = req.body;
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
      const animal = await new Category({
        name,
        active,
        type,
        parentId: parentId ? parentId : null,
        icon: icon ? icon : null,
      });
      const doc = await animal.save();
      return res
        .status(200)
        .json({
          status: 200,
          message: "Category created successfully",
          data: doc,
        });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in creating Category",
        errors: err,
        data: {},
      });
    }
  }

  async getall(req, res) {
    try {
      console.log("getting categories");
      const category = await Category.find(
        req.query.type ? { type: req.query.type } : {}
      ).populate("parentId");
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

  async deletebyId(req, res) {
    try {
      const category = await Category.deleteOne({ _id: req.params.id });
      return res
        .status(200)
        .json({
          status: 200,
          message: "Category deleted successfully",
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

  async updatebyId(req, res) {
    const { name, active } = req.body;
    if (!name) {
      return res.json({ status: 400, message: "name required", data: {} });
    }
    try {
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

  // Inventory Section.....
  // ##########################################################################

  async getInventoryByBreeder(req, res, next) {
    try {
      console.log ('inventory breeder');
      const { breederId } = req.params;
      const {type} = req.query;
      let match;
     
      if(type === 'animal') {
        match = await animalController.getAnimalForInventory(breederId);
        // console.log(animalResult.map(e => e.categoryId));
      } else {
        match = await productController.getProductForInventory(breederId);
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
            alive: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.aliveQuantity : a ,0),
            sold: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.soldQuantity : a ,0),
            died: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.deadQuantity : a ,0),
            pregnant: match.reduce((a, cv)=> (cv.categoryId.toString()===e._id.toString()) ? a+cv.pregnantQuantity : a ,0),
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


      const productReducer = (acc, currValue) => {
        currValue.items = currValue.items.map(e => {
          const status = {
            alive: match.reduce((a, cv)=> (cv.status==='Alive') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
            sold: match.reduce((a, cv)=> (cv.status==='Sold') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
            died: match.reduce((a, cv)=> (cv.healthStatus==='Died') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
            pregnant: match.reduce((a, cv)=> (cv.healthStatus==='Pregnant') && (cv.categoryId.toString()===e._id.toString()) ? a+1 : a ,0),
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
// subCategories: {$addToSet: { id: '$_id', name: '$name', type: '$type', icon: '$icon' }}
      Category.aggregate(
        [
          {$match: {
            _id: {$in: match.map(e => e.categoryId) } 
          }},
          { $group: { _id: "$parentId", category: {$first: '$parentId'}, items: {$push : '$$ROOT'} } },
        ])
        .exec()
        .then((result) => {
          Category.populate(result, {path: "category"}, (err, categoryDoc) => {
            const finalRes = categoryDoc.reduce((type==='animal') ? categoryReducer : productReducer, [])
            console.log(finalRes);
            return res
              .status(200)
              .json({
                status: 200,
                message: "Result found successfully",
                data: finalRes,
              });
          })
        })
        .catch((error) => {
          console.log(error);
          return res.json({ status: 400, message: "Error in finding result" });
        });
    } catch (error) {
      return next(error);
    }
  }


}

module.exports = new CategoryController();
