const { Location } = require("../models/Location");
const { validateLocationInput } = require("../validation/location");
class LocationController {
    constructor() { }

    //breeder create locations
    async create(req,res){
      const { errors, isValid } = validateLocationInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
      req.body.breederId=req.user._id
        try {      
            const locations= await new Location(req.body)
            const doc=await locations.save()
             return res.status(200).json({ status: 200, message: "Location  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Location ", errors: err, data: {} });
        }
    }

///admin
    async getall(req, res) {
      try {
        const locations= await Location.find({});
        return res.status(200).json({ status: 200, message: "All Location ",data: locations});
      } catch (err) {
        return res.json({ status: 400, message: "Error in get Location ", errors: err, data: {} });
      }
    }

    async deleteall(req,res){
      try {
          const locations= await Location.deleteMany({});
          return res.status(200).json({ status: 200, message: "All Locations deleted successfully",data: locations});
      } catch (err) {
          return res.json({ status: 400, message: "Error in deleting Location", errors: err, data: {} });
      }
  }
//////////


    async getallbreeder(req, res) {
        try {
          const locations= await Location.find({breederId:req.user._id});
          return res.status(200).json({ status: 200, message: "All Location ",data: locations});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Location ", errors: err, data: {} });
        }
      }

      async deleteallbreeder(req,res){
        try {
            const locations= await Location.deleteMany({breederId:req.user._id});
            return res.status(200).json({ status: 200, message: "All Locations deleted successfully",data: locations});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Location", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const locations= await Location.find({_id:req.params.id});
          if(locations== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Location",data: locations});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Location", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const locations= await Location.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Location deleted successfully",data: locations});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Location", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        //const {name,active}=req.body
    
        try {
            const locations = await Location.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Location updated successfully",data: locations });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Location", errors: err, data: {} });
        }
    }
    
};

module.exports = new LocationController();