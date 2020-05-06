const { Health } = require("../models/Animal/Health");
const { validateHealthInput } = require("../validation/health");
class HealthController {
    constructor() { }

//assign Health
    async create(req,res){
        const { errors, isValid } = validateHealthInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        const file = req.file
        if (!file) {
         return res.json({status:400,message:"Please upload image file (Only .png, .jpg and .jpeg format allowed)",errors:{file:"file is required (Only .png, .jpg and .jpeg format allowed)"},data:{}})
        }

        const {detail,animalId,date,location}=req.body

        try {      
            const animal = await new Health({detail,animalId,date,location,userId:req.user._id,document:res.req.file.path})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Health  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Health Animal ", errors: err, data: {} });
        }
    }

//admin
    async getall(req, res) {
        try {
          const health = await Health.find({});
          return res.status(200).json({ status: 200, message: "All Healths", data: health });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Healths", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const health = await Health.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Healths deleted successfully", data: health });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Health", errors: err, data: {} });
        }
    }
///


//admin
async getallbreeder(req, res) {
  try {
    const health = await Health.find({userId:req.user._id});
    return res.status(200).json({ status: 200, message: "All Healths", data: health });
  } catch (err) {
    return res.json({ status: 400, message: "Error in get Healths", errors: err, data: {} });
  }
}

async deleteallbreeder(req,res){
  try {
      const health = await Health.deleteMany({userId:req.user._id});
      return res.status(200).json({ status: 200, message: "All Healths deleted successfully", data: health });
  } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Health", errors: err, data: {} });
  }
}
///


    async getbyId(req, res){
        try {
          const health = await Health.find({_id:req.params.id});
          if(health == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Health", data: health });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Health", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const health = await Health.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Health deleted successfully", data: health });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Health", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
       

        try {
            const health = await Health.updateOne({_id:req.params.id}, req.body);
            const file = req.file
            if (file) {
                await Health.updateOne({_id:req.params.id}, {document:res.req.file.path});
            
            }
            return res.status(200).json({ status: 200, message: "Health updated successfully", data: health });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Health", errors: err, data: {} });
        }
    }
    
};

module.exports = new HealthController();