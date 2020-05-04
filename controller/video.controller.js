const { Video } = require("../models/Animal/Video");
// Load input validation
const { validateVideoInput} = require("../validation/animal");
const LogicController = require('../controller/logic.controller');

class VideoController {
    constructor() { }

////////////  Admin  //////////
    async getall(req, res) {
        let video;
        //console.log("params provided =",req.query.breederId)
        try {
            if(req.query.breederId ){
                video = await Video.find({breederId: req.query.breederId});
            }
            else{
            video = await Video.find({});
            }
            if(video == ''){
                return res.json({ status: 200, message: "No data found",  data: {} }); 
              }
            return res.status(200).json({ status: 200, message: "Videos found", data: video });
          } catch (err) {
            return res.json({ status: 400, message: "Error in get images", errors: err, data: {} });
          }
        }
    

    async deleteall(req,res){
        //console.log("isAdmin",req.user.isAdmin)
        let video;
        try {
            if(req.query.breederId ){
                video = await Video.deleteMany({breederId: req.query.breederId});
            }
            else{
            video = await Video.deleteMany({});
            LogicController.deleteallvideos()
            }
            return res.status(200).json({ status: 200, message: "All breeder Videos deleted successfully", data: video });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleted Animal images", errors: err, data: {} });
        }
    }

 ////////////////////////////



    addVideoAnimal(req, res) {
        const { errors, isValid } = validateVideoInput(req.body);
        if (!isValid) {
        console.log("err",errors)
        return res.json({status:400,message:"errors present", errors:errors,data:{}});
        }
        const file = req.file
        if (!file) {
         return res.json({status:400,message:"Please upload video file (Only mp4 file allowed)",errors:{file:"file is required"},data:{}})
        }
        const userId=req.user._id
        const {breederId,animalId,name}=req.body

        const video = new Video({userId,animalId,breederId,name,filepath:res.req.file.path});
        video.save(async (err, doc) => {
            if (err) return res.json({  status:400,message:"got error in adding animal video", errors:err,data:{} });

            try {
               //await Animal.updateOne({_id:animalId},{$push:{images:doc._id}});  
              } catch (err) {
                console.log(err)
              }
            return res.status(200).json({status:200,message:"Animal video is added successfully", data:doc});
        })
    }


    async getVideoAnimal(req, res) {
        try {
            const video = await Video.find({_id:req.params.id});
            if(video == ''){
                return res.json({ status: 200, message: "No data found",  data: {} }); 
              }
            return res.status(200).json({ status: 200, message: "Video found", data: video });
          } catch (err) {
            return res.json({ status: 400, message: "Error in get animals", errors: err, data: {} });
          }
        }
    

        async deleteVideoAnimal(req,res){
            //console.log("isAdmin",req.user.isAdmin)
            try {
                const video = await Video.deleteOne({_id:req.params.id});
                return res.status(200).json({ status: 200, message: "All breeder Animals deleted successfully", data: video });
            } catch (err) {
                return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
            }
        }
}
module.exports = new VideoController();