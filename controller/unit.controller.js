const { Unit } = require("../models/Unit");
class UnitController {
    constructor() { }

    //only admin
    async create(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name required", data: {} });
        }
        try {      
            const animal = await new Unit({name})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Unit of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Unit of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const unit = await Unit.find({});
          return res.status(200).json({ status: 200, message: "All Units", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Units", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const unit = await Unit.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Units deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Unit", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const unit = await Unit.find({_id:req.params.id});
          if(unit == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Unit", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Unit", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const unit = await Unit.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Unit deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Unit", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name field required", data: {} });
        }
        try {
            const unit = await Unit.updateOne({_id:req.params.id},{name});
    
            return res.status(200).json({ status: 200, message: "Unit updated successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Unit", errors: err, data: {} });
        }
    }
    
};

module.exports = new UnitController();