const { InvoiceItem } = require("../models/Invoice/InvoiceItem");
const { validateInvoiceItemInput } = require("../validation/invoice");
class InvoiceItemController {
    constructor() { }


    async create(req,res){
        const { errors, isValid } =await validateInvoiceItemInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }

        req.body.breederId=req.user._id
        try {      
            const animal = await new InvoiceItem(req.body)
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Invoice Item  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Invoice Item", errors: err, data: {} });
        }
    }

//////////admin
    async getall(req, res) {
        try {
          const invoive_ = await InvoiceItem.find({});
          return res.status(200).json({ status: 200, message: "All InvoiceItems", data: invoive_ });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get InvoiceItems", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const invoive_ = await InvoiceItem.deleteMany({});
            return res.status(200).json({ status: 200, message: "All InvoiceItems deleted successfully", data: invoive_ });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting InvoiceItem", errors: err, data: {} });
        }
    }
////////////


async getallbreeder(req, res) {
    try {
      const invoiceItem_= await InvoiceItem.find({breederId:req.user._id});
      return res.status(200).json({ status: 200, message: "All InvoiceItem of breeder",data: invoiceItem_});
    } catch (err) {
      return res.json({ status: 400, message: "Error in get InvoiceItem ", errors: err, data: {} });
    }
  }

  async deleteallbreeder(req,res){
    try {
        const invoiceItem_= await InvoiceItem.deleteMany({breederId:req.user._id});
        return res.status(200).json({ status: 200, message: "All Invoice Items deleted successfully",data: invoiceItem_});
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleting Invoice Item", errors: err, data: {} });
    }
}


    async getbyId(req, res){
        try {
          const invoive_ = await InvoiceItem.find({_id:req.params.id});
          if(invoive_ == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "InvoiceItem", data: invoive_ });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get InvoiceItem", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const invoive_ = await InvoiceItem.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Invoice Item deleted successfully", data: invoive_ });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Invoice Item", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const invoive_ = await InvoiceItem.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Invoice Item updated successfully", data: invoive_ });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating InvoiceItem", errors: err, data: {} });
        }
    }
    
};

module.exports = new InvoiceItemController();