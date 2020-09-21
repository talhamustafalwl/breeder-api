const { Activity } = require("../models/Activity/Activity");
const { validateActivity } = require("../validation/activity");
class ActivityController {
    constructor() { }


    async create(req,res){
        const { errors, isValid } =await validateActivity(req.body);
        // Check validation
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }

        req.body.breederId =req.user.role == "employee" ? req.user.breederId : req.user._id;
        req.body.addedBy = req.user._id;

        try {      
            const activity = await new Activity(req.body)
            const doc=await activity.save()
            return res.status(200).json({ status: 200, message: "Activity of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Activity of animal", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const cleaning = await Activity.find({});
          return res.status(200).json({ status: 200, message: "All Activitys", data: cleaning });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Activitys", errors: err, data: {} });
        }
      }




    async getbyId(req, res){
        try {
          const cleaning = await Activity.find({_id:req.params.id});
          if(cleaning == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Activity", data: cleaning });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Activity", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const cleaning = await Activity.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Activity deleted successfully", data: cleaning });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Activity", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        const {name,rotationName}=req.body

        try {
            const cleaning = await Activity.updateOne({_id:req.params.id},{name,rotationName});
    
            return res.status(200).json({ status: 200, message: "Activity updated successfully", data: cleaning });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Activity", errors: err, data: {} });
        }
    }
    
};

module.exports = new ActivityController();