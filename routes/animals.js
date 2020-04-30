const express = require('express');
const router = express.Router();
const { Animal } = require("../models/Animal/Animal");

//for admin crud can view all/delete all
router.route('/all').get(async (req, res) => {
    try {
      const animals = await Animal.find({}).populate('categoryId');
      return res.status(200).json({ status: 200, message: "All Animals", data: animals });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get animals", errors: err, data: {} });
    }
  })
  .delete(async(req,res)=>{
    try {
        const messages = await Animal.deleteMany({});
        return res.status(200).json({ status: 200, message: "All Animals deleted successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
    }
})


//for breeder  animals (admin) crud can view/delete all
router.route('/breeder/:breederId').get(async (req, res) => {
    try {
      const animals = await Animal.find({ breederId: req.params.breederId});
      return res.status(200).json({ status: 200, message: "Animal data", data: animals });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get animal", errors: err, data: {} });
    }
  })
  .delete(async(req,res)=>{
    try {
        const messages = await Animal.deleteMany({breederId: req.params.breederId});
        return res.status(200).json({ status: 200, message: "All breeder Animals deleted successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
    }
})



//for specific animal (admin) crud can update/view/delete all
router.route('/:id').get(async (req, res) => {
    try {
      const animals = await Animal.find({ _id: req.params.id});
      if(animals == ''){
        return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
      }
      return res.status(200).json({ status: 200, message: "Animal data", data: animals });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get animal", errors: err, data: {} });
    }
  })
  .delete(async(req,res)=>{
    try {
        const messages = await Animal.deleteOne({_id: req.params.id});
        return res.status(200).json({ status: 200, message: "All breeder Animals deleted successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
    }
})
.patch(async(req,res)=>{
    try {
        const messages = await Animal.updateOne({_id: req.params.id},req.body);
        return res.status(200).json({ status: 200, message: "Animals updated successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in updated Animal", errors: err, data: {} });
    }
})

router.post("/",async(req,res)=>{
    //const { errors, isValid } = validateaddInput(req.body);
    // if (!isValid) {
    //  console.log("errr",errors)
    //   return res.json({status:400,message:"errors present", errors:errors,data:{}});
    // }

    try {
        const animal = await new Animal(req.body)
        const doc=await animal.save()
        return res.status(200).json({ status: 200, message: "Animals created successfully", data: doc });
    } catch (err) {
        return res.json({ status: 400, message: "Error in creating Animal", errors: err, data: {} });
    }
})


module.exports=router