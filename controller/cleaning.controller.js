const { Cleaning } = require("../models/Cleaning/Cleaning");
const { validateCleaningInput } = require("../validation/cleanig");
class CleaningController {
    constructor() { }


    async create(req,res){
        const { errors, isValid } =await validateCleaningInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        const {name,rotationName}=req.body

        try {      
            const animal = await new Cleaning({name,rotationName,userId:req.user._id})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Cleaning of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Cleaning of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const cleaning = await Cleaning.find({});
          return res.status(200).json({ status: 200, message: "All Cleanings", data: cleaning });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Cleanings", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const cleaning = await Cleaning.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Cleanings deleted successfully", data: cleaning });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Cleaning", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const cleaning = await Cleaning.find({_id:req.params.id});
          if(cleaning == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Cleaning", data: cleaning });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Cleaning", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const cleaning = await Cleaning.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Cleaning deleted successfully", data: cleaning });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Cleaning", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name,rotationName}=req.body

        try {
            const cleaning = await Cleaning.updateOne({_id:req.params.id},{name,rotationName});
    
            return res.status(200).json({ status: 200, message: "Cleaning updated successfully", data: cleaning });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Cleaning", errors: err, data: {} });
        }
    }
    
};

module.exports = new CleaningController();