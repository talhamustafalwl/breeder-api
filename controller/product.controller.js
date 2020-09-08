const { Product } = require("../models/Product");
const { validateProductInput } = require("../validation/product");
const configKey = require("../config/key");

class ProductController {
    constructor() { }


    async create(req, res, next) {
      console.log( req.body)
       const { errors, isValid } = validateProductInput(req.body);
       if (!isValid) {
         console.log(errors)
         return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
       }
        let Images=[];
        await req.files.map((f)=>{
          Images.push(f.filename)
        })
       
      //req.body.breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
      req.body.breederId="5f3ba1f7a989412710841d5a"
      req.body.addedBy=req.user._id
      req.body.Images=Images
      try { 
        const products= await new Product(req.body)
        const doc=await products.save()
        return res.status(200).json({ status: 200, message: "Product created successfully", data: doc });
    } catch (err) {
        return res.json({ status: 400, message: "Error in creating Product", errors: err, data: {} });
    }
    }


    async getallbreeder(req, res) {
      console.log(req.user._id)
        //const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        const breederId="5f3ba1f7a989412710841d5a"
        try {
          const products= await Product.find({breederId}).populate('addedBy',"name")
          .then(result => {
            console.log(result);
            return res.status(200).json({ status: 200, message: "All Products", data: result.map(e=> ({...e.toObject(), ...{Images: e.toObject().Images.map(eimg => `${configKey.baseImageURL}${eimg}`)} }))})
        })
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Product ", errors: err, data: {} });
        }
      }

      async deleteallbreeder(req,res){
        const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        try {
            const products= await Product.deleteMany({breederId});
            return res.status(200).json({ status: 200, message: "All Products deleted successfully",data: products});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Product", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const products= await Product.find({_id:req.params.id});
          if(products== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Product",data: products});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Product", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const products= await Product.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Product deleted successfully",data: products});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Product", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        //const {name,active}=req.body
    
        try {
            const products = await Product.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Product updated successfully",data: products });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Product", errors: err, data: {} });
        }
    }
    
};

module.exports = new ProductController();