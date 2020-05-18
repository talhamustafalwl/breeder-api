const { Notification } = require("../models/Notification/Notification");
const { validateNotificationInput } = require("../validation/notification");
class NotificationController {
    constructor() { }

    //breeder create notifications
    async create(req,res){
      const { errors, isValid } = validateNotificationInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
       
        try {      
            const notifications= await new Notification(req.body)
            const doc=await notifications.save()
            return res.status(200).json({ status: 200, message: "Notification created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Notification", errors: err, data: {} });
        }
    }

    async getAll(req, res){
        try {
          const notifications= await Notification.find();
          if(notifications== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Notification",data: notifications});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Notification", errors: err, data: {} });
        }
      }

    async getbyId(req, res){
        try {
          const notifications= await Notification.find({_id:req.params.id});
          if(notifications== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Notification",data: notifications});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Notification", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const notifications= await Notification.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Notification deleted successfully",data: notifications});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Notification", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const notifications = await Notification.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Notification updated successfully",data: notifications });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Notification", errors: err, data: {} });
        }
    }
    
};

module.exports = new NotificationController();