const { Vacination } = require("../models/Vacination/Vacination");
const { validateVacinationInput } = require("../validation/vacination");
class VacinationController {
  constructor() { }


  async test () {
    console.log('test called');
  }

  //assign cleaning
  async create(req, res) {
    const { errors, isValid } = validateVacinationInput(req.body);
    // Check validation
    if (!isValid) {
      return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
    }
    const { name, rotationName, quantity, animalId, unitName } = req.body

    try {
      const animal = await new Vacination({ name, rotationName, animalId, unitName, quantity, userId: req.user._id })
      const doc = await animal.save()
      return res.status(200).json({ status: 200, message: "Vacination  created successfully", data: doc });
    } catch (err) {
      return res.json({ status: 400, message: "Error in creating Vacination Animal ", errors: err, data: {} });
    }
  }

  //admin
  async getall(req, res) {
    try {
      const vacination = await Vacination.find({});
      return res.status(200).json({ status: 200, message: "All Vacinations", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Vacinations", errors: err, data: {} });
    }
  }

  async deleteall(req, res) {
    try {
      const vacination = await Vacination.deleteMany({});
      return res.status(200).json({ status: 200, message: "All Vacinations deleted successfully", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Vacination", errors: err, data: {} });
    }
  }
  ///


  //admin
  async getallbreeder(req, res) {
    try {
      const vacination = await Vacination.find({ userId: req.user._id });
      return res.status(200).json({ status: 200, message: "All Vacinations", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Vacinations", errors: err, data: {} });
    }
  }

  async deleteallbreeder(req, res) {
    try {
      const vacination = await Vacination.deleteMany({ userId: req.user._id });
      return res.status(200).json({ status: 200, message: "All Vacinations deleted successfully", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Vacination", errors: err, data: {} });
    }
  }
  ///


  async getbyId(req, res) {
    try {
      const vacination = await Vacination.find({ _id: req.params.id });
      if (vacination == '') {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res.status(200).json({ status: 200, message: "Vacination", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Vacination", errors: err, data: {} });
    }
  }

  async deletebyId(req, res) {
    try {
      const vacination = await Vacination.deleteOne({ _id: req.params.id });
      return res.status(200).json({ status: 200, message: "Vacination deleted successfully", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Vacination", errors: err, data: {} });
    }
  }

  async updatebyId(req, res) {


    try {
      const vacination = await Vacination.updateOne({ _id: req.params.id }, req.body);

      return res.status(200).json({ status: 200, message: "Vacination updated successfully", data: vacination });
    } catch (err) {
      return res.json({ status: 400, message: "Error in updating Vacination", errors: err, data: {} });
    }
  }

};

module.exports = new VacinationController();