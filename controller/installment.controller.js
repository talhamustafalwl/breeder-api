const { Installment } = require("../models/Invoice/Installment");
const { validateInstallmentInput } = require("../validation/invoice");
class InstallmentController {
  constructor() { }


  async create(req, res) {
    const { errors, isValid } = await validateInstallmentInput(req.body);
    // Check validation
    if (!isValid) {
      return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
    }

    req.body.breederId = req.user._id
    try {
      const installment_ = await new Installment(req.body)
      const doc = await installment_.save()
      return res.status(200).json({ status: 200, message: "Invoice Item  created successfully", data: doc });
    } catch (err) {
      return res.json({ status: 400, message: "Error in creating Invoice Item", errors: err, data: {} });
    }
  }

  //////////admin
  async getall(req, res) {
    try {
      const invoive_ = await Installment.find({});
      return res.status(200).json({ status: 200, message: "All Installments", data: invoive_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Installments", errors: err, data: {} });
    }
  }

  async deleteall(req, res) {
    try {
      const invoive_ = await Installment.deleteMany({});
      return res.status(200).json({ status: 200, message: "All Installments deleted successfully", data: invoive_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Installment", errors: err, data: {} });
    }
  }
  ////////////


  async getallbreeder(req, res) {
    try {
      const installment_ = await Installment.find({ breederId: req.user._id });
      return res.status(200).json({ status: 200, message: "All Installment of breeder", data: installment_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Installment ", errors: err, data: {} });
    }
  }

  async deleteallbreeder(req, res) {
    try {
      const installment_ = await Installment.deleteMany({ breederId: req.user._id });
      return res.status(200).json({ status: 200, message: "All Invoice Items deleted successfully", data: installment_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Invoice Item", errors: err, data: {} });
    }
  }


  async getbyId(req, res) {
    try {
      const invoive_ = await Installment.find({ _id: req.params.id });
      if (invoive_ == '') {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res.status(200).json({ status: 200, message: "Installment", data: invoive_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Installment", errors: err, data: {} });
    }
  }

  async deletebyId(req, res) {
    try {
      const invoive_ = await Installment.deleteOne({ _id: req.params.id });
      return res.status(200).json({ status: 200, message: "Invoice Item deleted successfully", data: invoive_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Invoice Item", errors: err, data: {} });
    }
  }

  async updatebyId(req, res) {

    try {
      const invoive_ = await Installment.updateOne({ _id: req.params.id }, req.body);

      return res.status(200).json({ status: 200, message: "Invoice Item updated successfully", data: invoive_ });
    } catch (err) {
      return res.json({ status: 400, message: "Error in updating Installment", errors: err, data: {} });
    }
  }

  async addSaleInstallment(invoiceId, salesId, installment) {
    return new Promise((resolve, reject) => {
      const data = installment.map(e => ({ ...{ invoiceId, salesId }, ...e }));
      console.log('Adding sale installmnt');
      console.log(data);
      // installment contains amount startDate endDate isPaid and reminded
      Installment.insertMany(data, (err, result) => {
        console.log(result);
        if(err) return reject(true);
        return resolve(result);
      });
    });
  }

  async getSaleIntallment(salesId) {
    return new Promise((resolve, reject) => {
      Installment.find({salesId}).exec().then(resolve).catch(reject);
    });  
  }

};

module.exports = new InstallmentController();