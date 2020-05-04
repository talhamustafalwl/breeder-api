const { Image } = require("../models/Animal/Image");
// Load input validation
const { validateImageInput} = require("../validation/animal");
const LogicController = require('../controller/logic.controller');

class ImageController {
    constructor() { }

////////////  Admin  //////////
    async getall(req, res) {
        let image;
        //console.log("params provided =",req.query.breederId)
        try {
            if(req.query.breederId ){
                image = await Image.find({breederId: req.query.breederId});
            }
            else{
            image = await Image.find({});
            }
            if(image == ''){
                return res.json({ status: 200, message: "No data found",  data: {} }); 
              }
            return res.status(200).json({ status: 200, message: "Images found", data: image });
          } catch (err) {
            return res.json({ status: 400, message: "Error in get images", errors: err, data: {} });
          }
        }
    

    async deleteall(req,res){
        //console.log("isAdmin",req.user.isAdmin)
        let image;
        try {
            if(req.query.breederId ){
                image = await Image.deleteMany({breederId: req.query.breederId});
            }
            else{
            image = await Image.deleteMany({});
            LogicController.deleteallimages()
            }
            return res.status(200).json({ status: 200, message: "All breeder Images deleted successfully", data: image });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleted Animal images", errors: err, data: {} });
        }
    }

 ////////////////////////////



    addImageAnimal(req, res) {
        const { errors, isValid } = validateImageInput(req.body);
        if (!isValid) {
        console.log("err",errors)
        return res.json({status:400,message:"errors present", errors:errors,data:{}});
        }
        const file = req.file
        if (!file) {
         return res.json({status:400,message:"Please upload image file (Only .png, .jpg and .jpeg format allowed)",errors:{file:"file is required (Only .png, .jpg and .jpeg format allowed)"},data:{}})
        }
        const userId=req.user._id
        const {breederId,animalId,name}=req.body

        const image = new Image({userId,animalId,breederId,name,filepath:res.req.file.path});
        image.save(async (err, doc) => {
            if (err) return res.json({  status:400,message:"got error in adding animal image", errors:err,data:{} });

            try {
               //await Animal.updateOne({_id:animalId},{$push:{images:doc._id}});  
              } catch (err) {
                console.log(err)
              }
            return res.status(200).json({status:200,message:"Animal image is added successfully", data:doc});
        })
    }


    async getImageAnimal(req, res) {
        try {
            const image = await Image.find({_id:req.params.id});
            if(image == ''){
                return res.json({ status: 200, message: "No data found",  data: {} }); 
              }
            return res.status(200).json({ status: 200, message: "Image found", data: image });
          } catch (err) {
            return res.json({ status: 400, message: "Error in get animals", errors: err, data: {} });
          }
        }
    

        async deleteImageAnimal(req,res){
            //console.log("isAdmin",req.user.isAdmin)
            try {
                const image = await Image.deleteOne({_id:req.params.id});
                return res.status(200).json({ status: 200, message: "All breeder Animals deleted successfully", data: image });
            } catch (err) {
                return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
            }
        }
}
module.exports = new ImageController();