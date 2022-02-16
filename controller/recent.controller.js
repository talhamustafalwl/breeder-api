const { RecentSearch } = require("../models/RecentSearch");
class RecentController {
  constructor() {}

  async createRecentSearch(req, res, next) {
    try {
      const sid = req.body.searchId;

      const result = await RecentSearch.find({
        searchId: sid,
      });
      if (!result.length == 0) {
        return res.status(200).json({
          status: 400,
          message: "SearchId Already Exists",
        });
      } else {
        const recent = await new RecentSearch(req.body);
        const doc = await recent.save();
        return res.status(200).json({
          status: 200,
          message: "Activity created successfully",
          data: doc,
        });
      }
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async getRecentSearch(req, res, next) {
    console.log(req.body);
    try {
      const getRecent = await RecentSearch.find({});
      return res
        .status(200)
        .json({ status: 200, message: "All Recent Search", data: getRecent });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in get Recent Search",
        errors: err,
        data: {},
      });
    }
  }

  async deleteall(req, res) {
    try {
      const delall = await RecentSearch.deleteMany({});

      return res.status(200).json({
        status: 200,
        message: "All Recent Searches deleted successfully",
        data: delall,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleted Recent Searches",
        errors: err,
        data: {},
      });
    }
  }

  async deleteSearchbyId(req, res, next) {
    try {
      const deleteRecent = await RecentSearch.deleteOne({ _id: req.params.id });
      return res.status(200).json({
        status: 200,
        message: "Recent Search deleted successfully",
        data: deleteRecent,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in deleting Recent Search",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new RecentController();
