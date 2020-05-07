const { CleaningAnimal } = require("../models/Cleaning/CleaningAnimal");
const { validateCleaningAnimalInput } = require("../validation/cleanig");
class CleaningAnimalController {
    constructor() { }

//assign cleaning
    async create(req,res){
        const { errors, isValid } =await validateCleaningAnimalInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        const {cleaningName,rotationName,animalId,empId,date}=req.body

        try {      
            const animal = await new CleaningAnimal({cleaningName,rotationName,animalId,empId,date,userId:req.user._id})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "CleaningAnimal  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Cleaning Animal ", errors: err, data: {} });
        }
    }

//admin
    async getall(req, res) {
        try {
          const cleaningAnimal = await CleaningAnimal.find({});
          return res.status(200).json({ status: 200, message: "All CleaningAnimals", data: cleaningAnimal });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get CleaningAnimals", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const cleaningAnimal = await CleaningAnimal.deleteMany({});
            return res.status(200).json({ status: 200, message: "All CleaningAnimals deleted successfully", data: cleaningAnimal });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting CleaningAnimal", errors: err, data: {} });
        }
    }
///


//admin
async getallbreeder(req, res) {
  try {
    const cleaningAnimal = await CleaningAnimal.find({userId:req.user._id});
    return res.status(200).json({ status: 200, message: "All CleaningAnimals", data: cleaningAnimal });
  } catch (err) {
    return res.json({ status: 400, message: "Error in get CleaningAnimals", errors: err, data: {} });
  }
}

async deleteallbreeder(req,res){
  try {
      const cleaningAnimal = await CleaningAnimal.deleteMany({userId:req.user._id});
      return res.status(200).json({ status: 200, message: "All CleaningAnimals deleted successfully", data: cleaningAnimal });
  } catch (err) {
      return res.json({ status: 400, message: "Error in deleting CleaningAnimal", errors: err, data: {} });
  }
}
///


    async getbyId(req, res){
        try {
          const cleaningAnimal = await CleaningAnimal.find({_id:req.params.id});
          if(cleaningAnimal == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "CleaningAnimal", data: cleaningAnimal });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get CleaningAnimal", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const cleaningAnimal = await CleaningAnimal.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "CleaningAnimal deleted successfully", data: cleaningAnimal });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting CleaningAnimal", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
       

        try {
            const cleaningAnimal = await CleaningAnimal.updateOne({_id:req.params.id}, req.body);
    
            return res.status(200).json({ status: 200, message: "CleaningAnimal updated successfully", data: cleaningAnimal });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating CleaningAnimal", errors: err, data: {} });
        }
    }
    
};

module.exports = new CleaningAnimalController();