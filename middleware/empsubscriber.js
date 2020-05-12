const { User } = require('../models/User');
const { Subscriber } = require('../models/Subscription/Subscriber');
let employeesubscriber =async (req, res, next) => {
    let breederId=req.body.breederId
  if(breederId){
    console.log("employeesubscriber breederId",breederId)
    const countallowed=await Subscriber.findOne({breederId}).then(
        result=> result.allowedEmp
    )
    console.log("allowed Employee",countallowed)
    const countemployees=await User.find({breederId,role:"employee"}).then(
        employees=> employees
    )
    console.log("employees",countemployees.length)

    if(countallowed <= countemployees.length ){
        return res.json({status:400,message:"No more employees allowed (subscription limit reached)",data:{}
        });
    
    }
    }
  next()

};

module.exports = { employeesubscriber };