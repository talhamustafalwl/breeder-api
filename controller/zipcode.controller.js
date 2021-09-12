const { Zipcode } = require("../models/Zipcode");
// Load input validation
class ZipcodeController {
    constructor() { }

    //only admin
    async create(req,res){
        Zipcode.insertMany(req.body).then(function(){ 
            return res.status(200).json({ status: 200, message: "Zipcodes added", data: res.body });
        }).catch(function(error){ 
            return res.json({ status: 400, message: "Error in adding Zipcode", error: error });
        });
    }


    async getall(req, res) {
        let zipcode;
      
        try {
          zipcode = await Zipcode.find({});
          return res.status(200).json({ status: 200, message: "All Zipcodes", data: zipcode });
        } catch (err) {
          return res.json({ status: 400, message: "Error in getting Zipcodes", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
          let zipcode;
        try {
            if(req.query.cityId){
                zipcode = await Zipcode.deleteMany({cityId:req.query.cityId});
            }
            else{
                zipcode = await Zipcode.deleteMany({});
            }
            return res.status(200).json({ status: 200, message: "All Zipcode deleted successfully", data: zipcode });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Zipcode", errors: err, data: {} });
        }
    }

    async getbyCity(req, res){
        try {
          const zipcode = await Zipcode.find({City:req.params.city});
          return res.status(200).json({ status: 200, message: "Zipcodes", data: zipcode });
        } catch (err) {
          return res.json({ status: 400, message: "Error in getting Zipcode", errors: err, data: {} });
        }
      }

    async getbyId(req, res){
        try {
          const zipcode = await Zipcode.find({_id:req.params.id});
          if(zipcode == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Zipcode", data: zipcode });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Zipcode", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const zipcode = await Zipcode.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Zipcode deleted successfully", data: zipcode });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Zipcode", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const zipcode = await Zipcode.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Zipcode updated successfully", data: zipcode });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Zipcode", errors: err, data: {} });
        }
    }
    
};

module.exports = new ZipcodeController();