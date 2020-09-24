const { Category } = require("../models/Animal/Category");
const { restart } = require("nodemon");
const { imageURL, baseImageURL } = require("../config/dev");
const animalController = require("./animal.controller");
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
      const { breederId } = req.params;
      const {type} = req.query;
      let match;
      if(type === 'animal') {
        match = await animalController.getAnimalForInventory(breederId);
        // console.log(animalResult.map(e => e.categoryId));
      }

      Category.aggregate(
        [
          {$match: {
            _id: {$in: match.map(e => e.categoryId) } 
          }},
          { $group: { _id: "$parentId",  subCategories: { $sum: 1 }, subCategoriesData: {$addToSet: { id: '$_id', name: '$name', type: '$type', icon: '$icon' }} } }

        ])
        .exec()
        .then((result) => {
          return res
            .status(200)
            .json({
              status: 200,
              message: "Result found successfully",
              data: result,
            });
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
