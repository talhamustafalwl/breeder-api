const { Feed } = require("../models/Animal/Feed");
class FeedController {
    constructor() { }

    //only breeder (working on it)
    async create(req,res){
        const {name,active}=req.body
        if(!name){
            return res.json({ status: 400, message: "name required", data: {} });
        }
        try {      
            const animal = await new Feed({name,active})
            const doc=await animal.save()
            return res.status(200).json({ status: 200, message: "Feed of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Feed of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const feed = await Feed.find({});
          return res.status(200).json({ status: 200, message: "All Categories", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Categories", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const feed = await Feed.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Categories deleted successfully", data: feed });
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