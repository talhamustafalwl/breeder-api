const { Farm } = require("../models/Farm");
// Load input validation
const { validateFarmInput} = require("../validation/farm");
class FarmController {
    constructor() { }

    //only breeders
    async create(req,res){
        const { errors, isValid } = validateFarmInput(req.body);

        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "Errors present", errors: errors, data: {} });
        }
        const {name,categoryId,state,city,zipcode,categoryName}=req.body
        try {      
            const employee = await new Farm({name,categoryId,categoryName,state,city,zipcode,breederId:req.user._id})
            const doc=await employee.save()
            return res.status(200).json({ status: 200, message: "Farm of employee created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Farm of employee", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const farm = await Farm.find({breederId:req.user._id});
          return res.status(200).json({ status: 200, message: "All Farm", data: farm });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Farm", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const farm = await Farm.deleteMany({breederId:req.user._id});
            return res.status(200).json({ status: 200, message: "All Farm deleted successfully", data: farm });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Farm", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const farm = await Farm.find({_id:req.params.id});
          if(farm == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Farm", data: farm });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Farm", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const farm = await Farm.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Farm deleted successfully", data: farm });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Farm", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const farm = await Farm.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Farm updated successfully", data: farm });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Farm", errors: err, data: {} });
        }
    }
    
};

module.exports = new FarmController();