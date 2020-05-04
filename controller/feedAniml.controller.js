const { FeedAnimal } = require("../models/Feed/FeedAnimal");
const { validateFeedAnimalInput } = require("../validation/feed");
class FeedAnimalController {
    constructor() { }

    //breeder and employee can create
    async create(req,res){
      const { errors, isValid } = validateFeedAnimalInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
        const {animalId,description,quantity,feedId,rotation}=req.body

        try {      
            const animal = await new FeedAnimal({animalId,description,quantity,feedId,rotation,userId:req.user._id})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Feed of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Feed of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const feed = await FeedAnimal.find({userId:req.user._id});
          return res.status(200).json({ status: 200, message: "All FeedAnimals", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get FeedAnimals", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const feed = await FeedAnimal.deleteMany({userId:req.user._id});
            return res.status(200).json({ status: 200, message: "All FeedAnimals deleted successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting FeedAnimal", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const feed = await FeedAnimal.find({_id:req.params.id});
          if(feed == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "FeedAnimal", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get FeedAnimal", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const feed = await FeedAnimal.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "FeedAnimal deleted successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting FeedAnimal", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name,active}=req.body
        if(!name){
          return res.json({ status: 400, message: "name required", data: {} });
      }
        try {
            const feed = await FeedAnimal.updateOne({_id:req.params.id},{name,active});
    
            return res.status(200).json({ status: 200, message: "FeedAnimal updated successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating FeedAnimal", errors: err, data: {} });
        }
    }
    
};

module.exports = new FeedAnimalController();