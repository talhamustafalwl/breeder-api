const { Invoice } = require("../models/Invoice/Invoice");
const { validateInvoiceInput } = require("../validation/invoice");
const config = require("../config/key");
const invoiceReminder = require("../emails/invoiceReminder");
const mailer = require("../misc/mailer");

class InvoiceController {
    constructor() { }


    async create(req,res){
        const { errors, isValid } =await validateInvoiceInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        const {contactId,date,type}=req.body

        try {      
            const animal = await new Invoice({contactId,date,type,breederId:req.user._id})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Invoice of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Invoice of animal", errors: err, data: {} });
        }
    }

    async getInvoiceBySellerId(req, res, next) {
      try {
        const {saleId} = req.params;
        if(!req.params.saleId) return res.json({ status: 400, message: "SaleId is required" });
        Invoice.find({saleId, type: 'sale'}).then(resultInvoice => {
          return res.status(200).json({ status: 200, message: "Invoice of animal by sale found successfully", data: resultInvoice });
        });
      } catch(error) {
        return next(error);
      }
    }

    

    async invoiceReminderEmail(req, res, next) {
      console.log(req.body.buyerId.email,"<==req.buyerId.email")
      const html = invoiceReminder( config.webServer,req.body);
          mailer.sendEmail(
            config.mailthrough,
            req.body.buyerId.email,
            "Sale Invoice Reminder!",
            html
          );
      try {
          return res.status(200).json({ status: 200, message: "Invoice Reminder send successfully", data: [] });
       
      } catch(error) {
        return next(error);
      }
    }

//////////admin
    async getall(req, res) {
        try {
          const invoive_ = await Invoice.find({});
          return res.status(200).json({ status: 200, message: "All Invoices", data: invoive_ });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Invoices", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const invoive_ = await Invoice.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Invoices deleted successfully", data: invoive_ });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Invoice", errors: err, data: {} });
        }
    }
////////////


async getallbreeder(req, res) {
  breederId=req.user.role[0] === 'employee' ? req.user.breederId : req.user._id
    try {
      const invoice_= await Invoice.find({breederId:breederId});
      return res.status(200).json({ status: 200, message: "All Invoice of breeder",data: invoice_});
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Invoice ", errors: err, data: {} });
    }
  }

  async deleteallbreeder(req,res){
    try {
        const invoice_= await Invoice.deleteMany({breederId:req.user._id});
        return res.status(200).json({ status: 200, message: "All Invoices deleted successfully",data: invoice_});
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleting Invoice", errors: err, data: {} });
    }
}


    async getbyId(req, res){
        try {
          const invoive_ = await Invoice.find({_id:req.params.id});
          if(invoive_ == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Invoice", data: invoive_ });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Invoice", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const invoive_ = await Invoice.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Invoice deleted successfully", data: invoive_ });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Invoice", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {contactId,date,type}=req.body

        try {
            const invoive_ = await Invoice.updateOne({_id:req.params.id},{contactId,date,type});
    
            return res.status(200).json({ status: 200, message: "Invoice updated successfully", data: invoive_ });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Invoice", errors: err, data: {} });
        }
    }


    async addInvoice(type, saleId, invoiceNumber,  buyerId, sellerId,breederId, installmentId=null) {
      console.log(' in add invoice');
      return new Promise(async (resolve, reject) => {
        const invoice = await new Invoice({installmentId, type, saleId, invoiceNumber, buyerId, sellerId,breederId});
        console.log('in add in voice resolve');
        invoice.save().then((reuslAddInvoice) => { console.log('addInvoice added Done'); resolve(); }).catch(reject);
      });
    }

    async getAllInvoiceByBreeder(breederId) {
      return new Promise((resolve, reject) => {
        Invoice.find({breederId: breederId}).populate('buyerId').populate('installmentId').populate({path: 'saleId', populate: {path: 'animals.animalId'}} )
        .populate({path: 'saleId', populate: {path: 'products.productId'}} ).exec().then(resultInvoice => {
          resolve(resultInvoice);
        }).catch(error => {
          reject(error);
        })
      })
    }


    async softRemoveInvoice(req, res, next ) {
      try {
        const {id} = req.params;
        Invoice.update({_id: id}, {isRemoved: true}).then(resultRemove => {
          return res.status(200).json({ status: 200, message: "Invoice removed successfully" });
        })
      } catch(error) {
        return next(error);
      }
    }
    
};

module.exports = new InvoiceController();