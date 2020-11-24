const { Activity } = require("../models/Activity/Activity");
const { validateActivity } = require("../validation/activity");
const mongoose = require("mongoose");
const categoryController = require("./category.controller");
const { Category } = require("../models/Animal/Category");

class ActivityController {
  constructor() {}

  async create(req, res) {

    const { errors, isValid } = await validateActivity(req.body);
    // Check validation
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }

    req.body.breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    req.body.addedBy = req.user._id;

    try {
      const activity = await new Activity(req.body);
      const doc = await activity.save();
      return res.status(200).json({
        status: 200,
        message: "Activity of animal created successfully",
        data: doc,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in creating Activity of animal",
        errors: err,
        data: {},
      });
    }
  }

  async getall(req, res) {
    //console.log(req.query)
    var conditions = Object.keys(req.query).map(function (key) {
      var obj = {},
        newKey = "";
      if (key == "groupId" || key == "animalId" || key == "categoryId") {
        newKey = key;
      } else {
        newKey = key;
      }
      obj[newKey] = mongoose.Types.ObjectId(req.query[key]);
      return obj;
    });
    conditions = Object.assign({}, ...conditions);
    console.log(conditions);
    let tableName, matchedBy;
    if (req.query.groupId) {
      (tableName = "groups"), (matchedBy = "groupId");
    } else {
      (tableName = "animals"), (matchedBy = "animalId");
    }
    try {
      const cleaning = await Activity.aggregate([
        { $match: conditions },
        {
          $lookup: {
            from: tableName,
            localField: matchedBy,
            foreignField: "_id",
            as: matchedBy,
          },
        },
        { $unwind: { path: `$${matchedBy}` } },
        {
          $lookup: {
            from: "users",
            localField: "addedBy",
            foreignField: "_id",
            as: "addedBy",
          },
        },
        { $unwind: { path: `$addedBy` } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            data: { $push: "$$ROOT" },
          },
        },
        { $project: { data: "$data" } },
      ]);

      return res
        .status(200)
        .json({ status: 200, message: "All Activities", data: cleaning });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Activities",
        errors: err,
        data: {},
      });
    }
  }

  async getActivityData(req, res, next) {
    try {
      // categoryController.allCategories('activity').then(categoryResult => {

      // });
      Category.aggregate([
        {$match: {type: 'activity'}},
        {
          $lookup: {
            from: "activities",
            localField: "_id",
            foreignField: "categoryId",
            as: "activities",
          },
        },
      ])
        .then((result) => {
          console.log(result);
          return res
            .status(200)
            .json({ status: 200, message: "All Activities", data: result });
        })
        .catch((error) => {
          console.log(error);
          return res.status(200).json({ status: 400, message: "Error" });
        });
    } catch (error) {
      return next(error);
    }
  }

  async getallByType(req, res) {
    let tableName;
    if (req.query.type === "groupId") {
      tableName = "groups";
    } else {
      tableName = "animals";
    }

    try {
      const cleaning = await Activity.aggregate([
        {
          $match: { categoryId: mongoose.Types.ObjectId(req.query.categoryId) },
        },

        {
          $lookup: {
            from: tableName,
            localField: req.query.type,
            foreignField: "_id",
            as: req.query.type,
          },
        },
        { $unwind: { path: `$${req.query.type}` } },
        { $group: { _id: `$${req.query.type}`, detail: { $last: "$$ROOT" } } },
        { $project: { _id: 0 } },
      ]);

      return res.status(200).json({
        status: 200,
        message: `All Activities by ${req.query.type}`,
        data: cleaning,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Activities",
        errors: err,
        data: {},
      });
    }
  }

  async getbyId(req, res) {
    try {
      const cleaning = await Activity.find({ _id: req.params.id });
      if (cleaning == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Activity", data: cleaning });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Activity",
        errors: err,
        data: {},
      });
    }
  }

  async deletebyId(req, res) {
    try {
      const cleaning = await Activity.deleteOne({ _id: req.params.id });
      return res.status(200).json({
        status: 200,
        message: "Activity deleted successfully",
        data: cleaning,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Activity",
        errors: err,
        data: {},
      });
    }
  }

  async updatebyId(req, res) {
    const { name, rotationName } = req.body;

    try {
      const cleaning = await Activity.updateOne(
        { _id: req.params.id },
        req.body
      );

      return res.status(200).json({
        status: 200,
        message: "Activity updated successfully",
        data: cleaning,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Activity",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new ActivityController();
