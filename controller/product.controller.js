const { Product } = require("../models/Product");
const { validateProductInput } = require("../validation/product");
class ProductController {
    constructor() { }

    //breeder create products
    async create(req,res){
      const { errors, isValid } = validateProductInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
      req.body.breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
      req.body.addedBy=req.user._id
        try {      
            const products= await new Product(req.body)
            const doc=await products.save()
            //await Product.updateOne({ _id: doc._id }, { $set : { animalId: ["5eb110b3480eee32c2c368b2","5eb110a9480eee32c2c368b1"] }})

            return res.status(200).json({ status: 200, message: "Product of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Product of animal", errors: err, data: {} });
        }
    }


    async getallbreeder(req, res) {
        const breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
        try {
          const products= await Product.find({breederId});
          return res.status(200).json({ status: 200, message: "All Product ",data: products});
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