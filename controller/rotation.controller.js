const { Rotation } = require("../models/Rotation");
class RotationController {
    constructor() { }

    //only admin
    async create(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name required", data: {} });
        }
        try {      
            const animal = await new Rotation({name})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Rotation of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Rotation of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const rotation = await Rotation.find({});
          return res.status(200).json({ status: 200, message: "All Rotations", data: rotation });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Rotations", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const rotation = await Rotation.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Rotations deleted successfully", data: rotation });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Rotation", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const rotation = await Rotation.find({_id:req.params.id});
          if(rotation == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Rotation", data: rotation });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Rotation", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const rotation = await Rotation.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Rotation deleted successfully", data: rotation });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Rotation", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name field required", data: {} });
        }
        try {
            const rotation = await Rotation.updateOne({_id:req.params.id},{name});
    
            return res.status(200).json({ status: 200, message: "Rotation updated successfully", data: rotation });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Rotation", errors: err, data: {} });
        }
    }
    
};

module.exports = new RotationController();