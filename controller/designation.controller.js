const { Designation } = require("../models/Employee/Designation");
class DesignationController {
    constructor() { }

    //only breeders
    async create(req,res){
        const {name}=req.body
        if(!name){
            return res.json({ status: 400, message: "name required", data: {} });
        }
        try {      
            const employee = await new Designation({name,breederId:req.user._id})
            const doc=await employee.save()
            return res.status(200).json({ status: 200, message: "Designation of employee created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Designation of employee", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const designation = await Designation.find({breederId:req.user._id});
          return res.status(200).json({ status: 200, message: "All Designation", data: designation });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Designation", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const designation = await Designation.deleteMany({breederId:req.user._id});
            return res.status(200).json({ status: 200, message: "All Designation deleted successfully", data: designation });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Designation", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const designation = await Designation.find({_id:req.params.id});
          if(designation == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Designation", data: designation });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Designation", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const designation = await Designation.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Designation deleted successfully", data: designation });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Designation", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name}=req.body
        if(!name){
          return res.json({ status: 400, message: "name field required", data: {} });
      }
        try {
            const designation = await Designation.updateOne({_id:req.params.id},{name});
    
            return res.status(200).json({ status: 200, message: "Designation updated successfully", data: designation });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Designation", errors: err, data: {} });
        }
    }
    
};

module.exports = new DesignationController();