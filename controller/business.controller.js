const { Business} = require("../models/Breeder/Business");
const { validateBusinessInput } = require("../validation/bussiness");
class BusinessController {
    constructor() { }

//assign Business
    async create(req,res){
        const { errors, isValid } = validateBusinessInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        if(req.user.role != "breeder"){
          return res.json({ status: 400, message: "not authorized only for breeder", data: {} });
        }
        const {name,street1,street2,city,state,zipcode,email}=req.body
        let logo;
        if(req.file){
          logo=res.req.file.path
        }
        try {      
            const businessvar = await new Business({name,street1,street2,city,state,zipcode,email,breederId:req.user._id,logo})
            const doc=await businessvar.save()
            return res.status(200).json({ status: 200, message: "Business Profile created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: (err.name === 'MongoError' && err.code === 11000) ? 'Email already exists !' : "Error in creating Business Profile", errors: err, data: {} });
        }
    }

//admin
    async getall(req, res) {
        try {
          const health = await Business.find({});
          return res.status(200).json({ status: 200, message: "All Business", data: health });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Business", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const health = await Business.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Business deleted successfully", data: health });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Business", errors: err, data: {} });
        }
    }
///



async getallbreeder(req, res) {
  try {
    const health = await Business.find({breederId:req.user._id});
    return res.status(200).json({ status: 200, message: "All Business", data: health });
  } catch (err) {
    return res.json({ status: 400, message: "Error in get Business", errors: err, data: {} });
  }
}

async deleteallbreeder(req,res){
  try {
      const health = await Business.deleteMany({breederId:req.user._id});
      return res.status(200).json({ status: 200, message: "All Business deleted successfully", data: health });
  } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Business", errors: err, data: {} });
  }
}



    async getbyId(req, res){
        try {
          const health = await Business.find({_id:req.params.id});
          if(health == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Business", data: health });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Business", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const health = await Business.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Business Profiledeleted successfully", data: health });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Business", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
       

        try {
            const health = await Business.updateOne({_id:req.params.id}, req.body);
            const file = req.file
            if (file) {
                await Business.updateOne({_id:req.params.id}, {logo:res.req.file.path});
            
            }
            return res.status(200).json({ status: 200, message: "Business Profileupdated successfully", data: health });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Business", errors: err, data: {} });
        }
    }
    
};

module.exports = new BusinessController();