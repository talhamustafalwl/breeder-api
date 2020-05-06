const { VacinationAnimal } = require("../models/Vacination/VacinationAnimal");
const { validateVacinationAnimalInput } = require("../validation/vacination");
class VacinationAnimalController {
    constructor() { }

//assign cleaning
    async create(req,res){
        const { errors, isValid } = validateVacinationAnimalInput(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        const {vacinationId,description,animalId,empId,date}=req.body

        try {      
            const animal = await new VacinationAnimal({vacinationId,description,animalId,empId,date,userId:req.user._id})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "VacinationAnimal  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating VacinationAnimal Animal ", errors: err, data: {} });
        }
    }

//admin
    async getall(req, res) {
        try {
          const vacination = await VacinationAnimal.find({});
          return res.status(200).json({ status: 200, message: "All VacinationAnimals", data: vacination });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get VacinationAnimals", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const vacination = await VacinationAnimal.deleteMany({});
            return res.status(200).json({ status: 200, message: "All VacinationAnimals deleted successfully", data: vacination });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting VacinationAnimal", errors: err, data: {} });
        }
    }
///


//admin
async getallbreeder(req, res) {
  try {
    const vacination = await VacinationAnimal.find({userId:req.user._id});
    return res.status(200).json({ status: 200, message: "All VacinationAnimals", data: vacination });
  } catch (err) {
    return res.json({ status: 400, message: "Error in get VacinationAnimals", errors: err, data: {} });
  }
}

async deleteallbreeder(req,res){
  try {
      const vacination = await VacinationAnimal.deleteMany({userId:req.user._id});
      return res.status(200).json({ status: 200, message: "All VacinationAnimals deleted successfully", data: vacination });
  } catch (err) {
      return res.json({ status: 400, message: "Error in deleting VacinationAnimal", errors: err, data: {} });
  }
}
///


    async getbyId(req, res){
        try {
          const vacination = await VacinationAnimal.find({_id:req.params.id});
          if(vacination == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "VacinationAnimal", data: vacination });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get VacinationAnimal", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const vacination = await VacinationAnimal.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "VacinationAnimal deleted successfully", data: vacination });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting VacinationAnimal", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
       

        try {
            const vacination = await VacinationAnimal.updateOne({_id:req.params.id}, req.body);
    
            return res.status(200).json({ status: 200, message: "VacinationAnimal updated successfully", data: vacination });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating VacinationAnimal", errors: err, data: {} });
        }
    }
    
};

module.exports = new VacinationAnimalController();