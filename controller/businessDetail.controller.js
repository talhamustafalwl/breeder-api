const { BusinessDetail } = require("../models/BusinessDetail");
// const { validateBusinessInput } = require("../validation/bussiness");
class BusinessDetailController {
  constructor() {}

  //assign Business
  async create(req, res) {
    console.log("create called");
    // const { errors, isValid } = validateBusinessInput(req.body);
    // // Check validation
    // if (!isValid) {
    //   return res.json({
    //     status: 400,
    //     message: "errors present",
    //     errors: errors,
    //     data: {},
    //   });
    // }
    // if (req.user.role != "breeder") {
    //   return res.json({
    //     status: 400,
    //     message: "not authorized only for breeder",
    //     data: {},
    //   });
    // }
    const { businessDetails } = req.body;
    console.log("businessDetails", businessDetails);
    // let logo;
    // if (req.file) {
    //   logo = res.req.file.path;
    // }
    try {
      const {
        businessInfo,
        daysOpen,
        openHrStart,
        openHrEnd,
        breakTimeStart,
        breakTimeEnd,
        holidays,
        taxPercentage,
      } = businessDetails;
      const businessDetailvar = await new BusinessDetail({
        businessInfo: businessInfo,
        daysOpen: daysOpen,
        openHrStart: openHrStart,
        openHrEnd: openHrEnd,
        breakTimeStart: breakTimeStart,
        breakTimeEnd: breakTimeEnd,
        holidays: holidays,
        taxPercentage: taxPercentage,
        breederId: req.user._id,
      });
      console.log("businessDetailvar", businessDetailvar);
      const doc = await businessDetailvar.save();
      return res.status(200).json({
        status: 200,
        message: "Business Details created successfully",
        data: doc,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message:
          err.name === "MongoError" && err.code === 11000
            ? "Email already exists !"
            : "Error in creating Business Details",
        errors: err,
        data: {},
      });
    }
  }

  //admin
  //   async getall(req, res) {
  //     try {
  //       const health = await Business.find({});
  //       return res
  //         .status(200)
  //         .json({ status: 200, message: "All Business", data: health });
  //     } catch (err) {
  //       return res.json({
  //         status: 400,
  //         message: "Error in get Business",
  //         errors: err,
  //         data: {},
  //       });
  //     }
  //   }

  //   async deleteall(req, res) {
  //     try {
  //       const health = await Business.deleteMany({});
  //       return res.status(200).json({
  //         status: 200,
  //         message: "All Business deleted successfully",
  //         data: health,
  //       });
  //     } catch (err) {
  //       return res.json({
  //         status: 400,
  //         message: "Error in deleting Business",
  //         errors: err,
  //         data: {},
  //       });
  //     }
  //   }
  //   ///

  //   async getallbreeder(req, res) {
  //     try {
  //       const health = await Business.find({ breederId: req.user._id });
  //       return res
  //         .status(200)
  //         .json({ status: 200, message: "All Business", data: health });
  //     } catch (err) {
  //       return res.json({
  //         status: 400,
  //         message: "Error in get Business",
  //         errors: err,
  //         data: {},
  //       });
  //     }
  //   }

  //   async deleteallbreeder(req, res) {
  //     try {
  //       const health = await Business.deleteMany({ breederId: req.user._id });
  //       return res.status(200).json({
  //         status: 200,
  //         message: "All Business deleted successfully",
  //         data: health,
  //       });
  //     } catch (err) {
  //       return res.json({
  //         status: 400,
  //         message: "Error in deleting Business",
  //         errors: err,
  //         data: {},
  //       });
  //     }
  //   }

  async getbyId(req, res) {
    try {
      const health = await BusinessDetail.find({ _id: req.params.id });
      if (health == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Business Details", data: health });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Business Details",
        errors: err,
        data: {},
      });
    }
  }

  //   async deletebyId(req, res) {
  //     try {
  //       const health = await Business.deleteOne({ _id: req.params.id });
  //       return res.status(200).json({
  //         status: 200,
  //         message: "Business Profiledeleted successfully",
  //         data: health,
  //       });
  //     } catch (err) {
  //       return res.json({
  //         status: 400,
  //         message: "Error in deleting Business",
  //         errors: err,
  //         data: {},
  //       });
  //     }
  //   }

  //   async updatebyId(req, res) {
  //     try {
  //       const health = await Business.updateOne({ _id: req.params.id }, req.body);
  //       const file = req.file;
  //       if (file) {
  //         await Business.updateOne(
  //           { _id: req.params.id },
  //           { logo: res.req.file.path }
  //         );
  //       }
  //       return res.status(200).json({
  //         status: 200,
  //         message: "Business Profileupdated successfully",
  //         data: health,
  //       });
  //     } catch (err) {
  //       return res.json({
  //         status: 400,
  //         message: "Error in updating Business",
  //         errors: err,
  //         data: {},
  //       });
  //     }
  //   }
}

module.exports = new BusinessDetailController();
