const { Subscription } = require("../models/Subscription/Subscription");
const { validateSubscriptionInput } = require("../validation/subscription");
const config = require("../config/key");

class SubscriptionController {
    constructor() { }

    //breeder and employee can create
    async create(req,res) {
      console.log('creating subscription..');
      const { errors, isValid } = validateSubscriptionInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }

        try {    
          console.log(req.body);  
            if(req.body.defaultPackage === 'true') {
              Subscription.findOne({defaultPackage: true}).then(async result => {
                if(result) return res.json({ status: 400, message: "Default Package is already exist!", data: {} });
                const animal = await new Subscription(
                  {
                    ...req.body,
                    icon: req.file ? req.file.filename: null, 
                    currency: 'USD',
      
                  }
                  )
                  const doc=await animal.save()
                  return res.status(200).json({ status: 200, message: "Subscription  created successfully", data: doc });
              })
            } else {
              const animal = await new Subscription(
                {
                  ...req.body,
                  defaultPackage: false,
                  icon: req.file ? req.file.filename: null, 
                  currency: 'USD',
                }
                )
                const doc=await animal.save()
                return res.status(200).json({ status: 200, message: "Subscription  created successfully", data: doc });
            }
           
        } catch (err) {
          console.log(err);
            return res.json({ status: 400, message: "Error in creating Subscription ", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const feed = await Subscription.find({});
          return res.status(200).json({ status: 200, message: "All Subscriptions", data: feed.map(e=>e.toObject()).map(e => ({...e,   icon: e.icon ?  `${config.baseImageURL}${e.icon}` : null,})) });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Subscriptions", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const feed = await Subscription.deleteMany({});
            return res.status(200).json({ status: 200, message: "All Subscriptions deleted successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Subscription", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const feed = await Subscription.find({_id:req.params.id});
          if(feed == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Subscription", data: feed });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Subscription", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const feed = await Subscription.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Subscription deleted successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Subscription", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
      if(req.body.priceMethod && req.body.priceMethod === "Lifetime"){
        req.body.monthlyPrice=null; req.body.yearlyPrice=null
      }
      if(req.body.priceMethod && req.body.priceMethod === "Monthly & Yearly"){
        req.body.lifetimePrice=null;
      }
        try {
            const feed = await Subscription.updateOne({_id:req.params.id}, {...req.body,   icon: req.file ? req.file.filename: req.body.icon, } );
    
            return res.status(200).json({ status: 200, message: "Subscription updated successfully", data: feed });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Subscription", errors: err, data: {} });
        }
    }
    
};

module.exports = new SubscriptionController();