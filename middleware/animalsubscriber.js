const { Animal } = require('../models/Animal/Animal');
const { Subscriber } = require('../models/Subscription/Subscriber');
let animalsubscriber =async (req, res, next) => {
    let breederId;
    breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
  //console.log("animalsubscriber breederId",breederId)

  const countallowed=await Subscriber.findOne({breederId}).then(
      result => result.allowedAnimal
  )
  //console.log("allowedAnimal",countallowed)
  const countanimals=await Animal.find({breederId}).then(
      animals=> animals
  )
  //console.log("animals",countanimals.length)

  if(countallowed <= countanimals.length ){
    return res.json({status:400,message:"No more animals allowed (subscription limit reached)",data:{}
      });
   
  }
  next()

};

module.exports = { animalsubscriber };