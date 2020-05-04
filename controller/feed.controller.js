const { Feed } = require("../models/Feed/Feed");
const { validateFeedInput } = require("../validation/feed");
class FeedController {
    constructor() { }

    //breeder and employee can create
    async create(req,res){
      const { errors, isValid } = validateFeedInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
        const {name,unitName,units}=req.body

        try {      
            const animal = await new Feed({name,unitName,units,userId:req.user._id})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Feed of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Feed of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const feed = await Feed.find({userId:req.user._id});
          return res.status(200).json({ status: 200, message: "All Feeds", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Feeds", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const feed = await Feed.deleteMany({userId:req.user._id});
            return res.status(200).json({ status: 200, message: "All Feeds deleted successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Feed", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const feed = await Feed.find({_id:req.params.id});
          if(feed == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Feed", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Feed", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const feed = await Feed.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Feed deleted successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Feed", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name,active}=req.body
        if(!name){
          return res.json({ status: 400, message: "name required", data: {} });
      }
        try {
            const feed = await Feed.updateOne({_id:req.params.id},{name,active});
    
            return res.status(200).json({ status: 200, message: "Feed updated successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Feed", errors: err, data: {} });
        }
    }
    
};

module.exports = new FeedController();