const { City } = require("../models/City");
// Load input validation
class CityController {
    constructor() { }

    //only breeders
    async create(req,res){

        try {      
            const employee = await new City(req.body)
            const doc=await employee.save()
            return res.status(200).json({ status: 200, message: "City  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating City ", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        let city;
      
        try {
            if(req.query.stateId){
                city = await City.find({stateId:req.query.stateId});
            }
            else{
                city = await City.find({});
            }
          return res.status(200).json({ status: 200, message: "All City", data: city });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get City", errors: err, data: {} });
        }
      }

    //   async getCityByState (req, res, next) {
    //       try {
    //             await City.find({})
    //       }
    //       catch(error) {
    //         return res.json({ status: 400, message: "Error in get City by state", errors: err, data: {} });
    //       }
    //   }

      async deleteall(req,res){
          let city;
        try {
            if(req.query.stateId){
                city = await City.deleteMany({stateId:req.query.stateId});
            }
            else{
                city = await City.deleteMany({});
            }
            return res.status(200).json({ status: 200, message: "All City deleted successfully", data: city });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting City", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const city = await City.find({_id:req.params.id});
          if(city == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "City", data: city });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get City", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const city = await City.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "City deleted successfully", data: city });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting City", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const city = await City.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "City updated successfully", data: city });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating City", errors: err, data: {} });
        }
    }
    
};

module.exports = new CityController();