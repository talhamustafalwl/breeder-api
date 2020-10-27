const { Group } = require("../models/Group/Group");
const { validateGroupInput } = require("../validation/group");
class GroupController {
    constructor() { }


    async isAnimalAvailable(animalId) {
      console.log('animal available');
      return new Promise((resolve, reject) => {
        Group.find({animals: {$elemMatch: {id: animalId}}}).then(result => {
          if(result[0]) resolve(true);
          resolve(false);
        });
      });
    }


    async create(req,res){
        const { errors, isValid } = validateGroupInput(req.body);
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }
        req.body.breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
       
        try {      
            const group_ = await new Group(req.body)
            const doc=await group_.save()
            return res.status(200).json({ status: 200, message: "Group created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Group", errors: err, data: {} });
        }
    }


    async getallbreeder(req, res) {
      console.log(req.user);
        const breederId=req.user.role[0] == "employee" ? req.user.breederId : req.user._id
        try {
          const unit = await Group.find({breederId}).sort({ createdAt: -1 });
          return res.status(200).json({ status: 200, message: "All Groups", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Groups", errors: err, data: {} });
        }
      }

      async deleteallbreeder(req,res){
        try {
            const unit = await Group.deleteMany({breederId:req.user._id});
            return res.status(200).json({ status: 200, message: "All Groups deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Group", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const unit = await Group.findOne({_id:req.params.id});
          if(unit == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Group", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Group", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const unit = await Group.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Group deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Group", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        try {
            const unit = await Group.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Group updated successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Group", errors: err, data: {} });
        }
    }


    ////admin
    async getall(req, res) {
        try {
          const unit = await Group.find({});
          return res.status(200).json({ status: 200, message: "All Groups", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Groups", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const unit = await Group.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Groups deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Group", errors: err, data: {} });
        }
    }
/////
    
};

module.exports = new GroupController();