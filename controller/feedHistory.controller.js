const { FeedHistory } = require("../models/Feed/FeedHistory");
const { validateFeedHistoryInput } = require("../validation/feed");
class FeedHistoryController {
    constructor() { }

    //breeder assign feed to employee
    async create(req,res){
      const { errors, isValid } = validateFeedHistoryInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
        const {animalId,empId,quantity,feedanimalId,date}=req.body

        try {      
            const feedhistory = await new FeedHistory({animalId,empId,quantity,feedanimalId,userId:req.user._id,date})
            const doc=await feedhistory.save()
            return res.status(200).json({ status: 200, message: "Feed history of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Feed history of animal", errors: err, data: {} });
        }
    }

///admin
    async getall(req, res) {
      try {
        const feedhistory = await FeedHistory.find({});
        return res.status(200).json({ status: 200, message: "All Feed History", data: feedhistory });
      } catch (err) {
        return res.json({ status: 400, message: "Error in get Feed History", errors: err, data: {} });
      }
    }

    async deleteall(req,res){
      try {
          const feedhistory = await FeedHistory.deleteMany({});
          return res.status(200).json({ status: 200, message: "All FeedHistorys deleted successfully", data: feedhistory });
      } catch (err) {
          return res.json({ status: 400, message: "Error in deleting FeedHistory", errors: err, data: {} });
      }
  }



    async getallbreeder(req, res) {
        try {
          const feedhistory = await FeedHistory.find({userId:req.user._id});
          return res.status(200).json({ status: 200, message: "All Feed History", data: feedhistory });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Feed History", errors: err, data: {} });
        }
      }

      async deleteallbreeder(req,res){
        try {
            const feedhistory = await FeedHistory.deleteMany({userId:req.user._id});
            return res.status(200).json({ status: 200, message: "All FeedHistorys deleted successfully", data: feedhistory });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting FeedHistory", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const feedhistory = await FeedHistory.find({_id:req.params.id});
          if(feedhistory == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "FeedHistory", data: feedhistory });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get FeedHistory", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const feedhistory = await FeedHistory.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "FeedHistory deleted successfully", data: feedhistory });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting FeedHistory", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        //const {name,active}=req.body
    
        try {
            const feed = await FeedHistory.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "FeedHistory updated successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating FeedHistory", errors: err, data: {} });
        }
    }
    
};

module.exports = new FeedHistoryController();