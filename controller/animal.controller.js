const fs = require('fs')
const path = require('path');
const { Animal } = require("../models/Animal/Animal");
const LogicController = require('../controller/logic.controller');
class AnimalController {
    constructor() { }

//admin get delete all animals
   async getall(req, res) {
        try {
          const animals = await Animal.find({})
          return res.status(200).json({ status: 200, message: "All Animals", data: animals });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get animals", errors: err, data: {} });
        }
      }
    async deleteall(req,res){
        try {
            const messages = await Animal.deleteMany({});
            LogicController.deleteallqr()
            return res.status(200).json({ status: 200, message: "All Animals deleted successfully", data: messages });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
        }
    }




//get delete animal for specific breeder by admin
async getBreederAnimalsAdmin(req, res){
    //console.log("isAdmin",req.user.isAdmin)
    try {
      const animals = await Animal.find({ breederId: req.params.breederId});
      if(animals == ''){
        return res.json({ status: 200, message: "No data",  data: {} }); 
      }
      return res.status(200).json({ status: 200, message: "Animal data", data: animals });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get animal", errors: err, data: {} });
    }
  }

  async deleteBreederAnimalsAdmin(req,res){
    //console.log("isAdmin",req.user.isAdmin)
    try {
        const messages = await Animal.deleteMany({breederId: req.params.breederId});
        return res.status(200).json({ status: 200, message: "All breeder Animals deleted successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
    }
}


//get specific animal  by id
async getanimal(req, res){
    try {
      const animals = await Animal.find({ _id: req.params.id});
      if(animals == ''){
        return res.json({ status: 400, message: "Invalid animal Id",  data: {} }); 
      }
      return res.status(200).json({ status: 200, message: "Animal data", data: animals });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get animal", errors: err, data: {} });
    }
  }

//only breeder owner and admin can delete animal
  async deleteanimal(req,res){
    try {
        const data=await Animal.findOne({_id: req.params.id}) 
        await LogicController.deleteqr(data)
        const animal = await Animal.deleteOne({_id: req.params.id})        
        return res.status(200).json({ status: 200, message: "Animal deleted successfully", data: animal });
    } catch (err) {
        return res.json({ status: 400, message: "Error in delete Animal", errors: err, data: {} });
    }
}
//only breeder owner and admin can update animal
async updateanimal(req,res){
    console.log("called")
    try {
        const messages = await Animal.updateOne({_id: req.params.id},req.body);
        return res.status(200).json({ status: 200, message: "Animals updated successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in updated Animal", errors: err, data: {} });
    }
}


///
//get delete animal of specific breeder
async getBreederAnimals(req, res){
    console.log("login user id",req.user._id)
    try {
      const animals = await Animal.find({ breederId: req.user._id});
      if(animals == ''){
        return res.json({ status: 400, message: "No data",  data: {} }); 
      }
      return res.status(200).json({ status: 200, message: "Animal data", data: animals });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get animal", errors: err, data: {} });
    }
  }

  async deleteBreederAnimals(req,res){
    console.log("login user id",req.user._id)
    try {
        const messages = await Animal.deleteMany({breederId: req.user._id});
        return res.status(200).json({ status: 200, message: "All breeder Animals deleted successfully", data: messages });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleted Animals", errors: err, data: {} });
    }
}

async addBreederAnimals(req,res){
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
}

};

module.exports = new AnimalController();