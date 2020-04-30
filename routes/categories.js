const express = require('express');
const router = express.Router();
const { Category } = require("../models/Animal/Category");
const { adminauth } = require("../middleware/adminauth");

//create category only by admin
router.post("/",adminauth,async(req,res)=>{
    const {name,active}=req.body
    if(!name){
        return res.json({ status: 400, message: "name required", data: {} });
    }
    try {      
        const animal = await new Category({name,active})
        const doc=await animal.save()
        return res.status(200).json({ status: 200, message: "Category of animal created successfully", data: doc });
    } catch (err) {
        return res.json({ status: 400, message: "Error in creating Category of animal", errors: err, data: {} });
    }
})



//for see/delete all
router.route('/all').get(async (req, res) => {
    try {
      const category = await Category.find({});
      return res.status(200).json({ status: 200, message: "All Categories", data: category });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Categories", errors: err, data: {} });
    }
  })
  .delete(async(req,res)=>{
    try {
        const category = await Category.deleteMany({});
        return res.status(200).json({ status: 200, message: "All Categories deleted successfully", data: category });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleting Category", errors: err, data: {} });
    }
})


//for see/delete/update category by id
router.route('/:id').get(async (req, res) => {
    try {
      const category = await Category.find({_id:req.params.id});
      if(category == ''){
        return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
      }
      return res.status(200).json({ status: 200, message: "Category", data: category });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Category", errors: err, data: {} });
    }
  })
  .delete(async(req,res)=>{
    try {
        const category = await Category.deleteOne({_id:req.params.id});
        return res.status(200).json({ status: 200, message: "All Categories deleted successfully", data: category });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleting Category", errors: err, data: {} });
    }
})
.patch(async(req,res)=>{
    const {name,active}=req.body
    try {
        const category = await Category.updateOne({_id:req.params.id},{name,active});

        return res.status(200).json({ status: 200, message: "Category updated successfully", data: category });
    } catch (err) {
        return res.json({ status: 400, message: "Error in updating Category", errors: err, data: {} });
    }
})

module.exports=router