const { Activity } = require("../models/Activity/Activity");
const { ActivityHistory } = require("../models/Activity/ActivityHistory");
const { validateActivity } = require("../validation/activity");
const mongoose = require("mongoose");
const categoryController = require("./category.controller");
const { Category } = require("../models/Animal/Category");

class ActivityController {
  constructor() {}

    async create(req, res) {
      console.log(req.body)
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
        const activity = await new ActivityHistory(req.body);
        const doc = await activity.save();
        return res.status(200).json({
          status: 200,
          message: "Activity created successfully",
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
            console.log("req.query",req.query)
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
            const cleaning = await ActivityHistory.aggregate([
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



        async getallByType(req, res) {
          console.log("req.query",req.query)
            let tableName;
            if (req.query.type === "groupId") {
              tableName = "groups";
            } else {
              tableName = "animals";
            }
            try {
              const cleaning = await ActivityHistory.aggregate([
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

}

module.exports = new ActivityController();
