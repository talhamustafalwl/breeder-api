const { Status } = require("../models/Animal/Status");
class StatusController {
    constructor() { }

    //only admin
    async create(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name required", data: {} });
        }
        try {      
            const animal = await new Status({name})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Status of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Status of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const status = await Status.find({});
          return res.status(200).json({ status: 200, message: "All Statuss", data: status });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Statuss", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const status = await Status.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Statuss deleted successfully", data: status });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Status", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const status = await Status.find({_id:req.params.id});
          if(status == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Status", data: status });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Status", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const status = await Status.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Status deleted successfully", data: status });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Status", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name field required", data: {} });
        }
        try {
            const status = await Status.updateOne({_id:req.params.id},{name});
    
            return res.status(200).json({ status: 200, message: "Status updated successfully", data: status });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Status", errors: err, data: {} });
        }
    }
    
};

module.exports = new StatusController();