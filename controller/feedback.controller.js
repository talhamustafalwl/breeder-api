const { Feedback } = require("../models/Feedback");
const mailer = require("../misc/mailer");
const feedbackEmail = require("../emails/feedbackEmail");
const config = require("../config/key");

class FeedbackController {
    constructor() { }

    async create(req,res){
        try {      
            const animal = await new Feedback(req.body)
            const doc=await animal.save()
            const html = feedbackEmail(req.body);
            mailer.sendEmail( config.mailthrough,config.mailFeedback, "Feedback", html );
            return res.status(200).json({ status: 200, message: "Feedback submitted successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in submitting Feedback", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const feed = await Feedback.find({});
          return res.status(200).json({ status: 200, message: "All Feedbacks", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Feedbacks", errors: err, data: {} });
        }
      }


    async getbyId(req, res){
        try {
          const feedback = await Feedback.find({_id:req.params.id});
          if(feedback == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Feedback", data: feedback });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Feedback", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const feedback = await Feedback.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Feedback deleted successfully", data: feedback });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Feedback", errors: err, data: {} });
        }
    }

    
};

module.exports = new FeedbackController();