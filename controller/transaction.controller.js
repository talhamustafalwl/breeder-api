const { Transaction } = require("../models/Subscription/Transaction");
// Load input validation
class TransactionController {
    constructor() { }



    async getall(req, res) {
        try {
          const state = await Transaction.find({});
          return res.status(200).json({ status: 200, message: "All Transaction", data: state });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Transaction", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const state = await Transaction.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Transaction deleted successfully", data: state });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Transaction", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const state = await Transaction.find({_id:req.params.id});
          if(state == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Transaction", data: state });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Transaction", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const state = await Transaction.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Transaction deleted successfully", data: state });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Transaction", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const state = await Transaction.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Transaction updated successfully", data: state });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Transaction", errors: err, data: {} });
        }
    }
    
};

module.exports = new TransactionController();