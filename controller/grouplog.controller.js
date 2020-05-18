const { GroupLog } = require("../models/Group/GroupLog");
const { validateGroupLogInput } = require("../validation/group");
class GroupLogController {
    constructor() { }

    async create(req,res){
        const { errors, isValid } = validateGroupLogInput(req.body);
        if (!isValid) {
          return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
        }

        try {      
            const group_ = await new GroupLog(req.body)
            const doc=await group_.save()
            return res.status(200).json({ status: 200, message: "GroupLog created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating GroupLog", errors: err, data: {} });
        }
    }


 
    async getbyId(req, res){
        try {
          const unit = await GroupLog.find({_id:req.params.id});
          if(unit == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "GroupLog", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get GroupLog", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const unit = await GroupLog.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "GroupLog deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting GroupLog", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        try {
            const unit = await GroupLog.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "GroupLog updated successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating GroupLog", errors: err, data: {} });
        }
    }


    ////admin
    async getall(req, res) {
        try {
          const unit = await GroupLog.find({});
          return res.status(200).json({ status: 200, message: "All GroupLogs", data: unit });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get GroupLogs", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const unit = await GroupLog.deleteMany({});
            return res.status(200).json({ status: 200, message: "All GroupLogs deleted successfully", data: unit });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting GroupLog", errors: err, data: {} });
        }
    }
/////
    
};

module.exports = new GroupLogController();