const { Subscriber } = require("../models/Subscription/Subscriber");
const { Subscription } = require("../models/Subscription/Subscription");
const { Transaction } = require("../models/Subscription/Transaction");
const LogicController = require("./logic.controller");
const { validateSubscriberInput } = require("../validation/subscriber");
const config = require("../config/key");
const PaymentSesrvice = require('../misc/payment');


class SubscriberController {
  constructor() {}


  async initialSubscribeBreeder (breederId) {
      return new Promise((resolve, reject) => {
        Subscription.findOne({defaultPackage: true}).then((result) => {
          console.log(result);
          // subscribe package monthly..
          const subscriber = new Subscriber({
            userType: "breeder",
            userId: breederId,
            fromDate: new Date(),
            // toDate: new Date(Date.now() +  * 24 * 60 * 60 * 1000),
            toDate: new Date(new Date().setMonth(new Date().getMonth()+1)),
            subscriptionId: result._id,
            type: 'monthly'
          });
  
  
          subscriber.save().then(subscriberResult => {
            resolve(subscriberResult);
          }).catch(error => {
            reject(error);
          });
        });
      });    
  }




  async createCard(req, res) {
    // PaymentSesrvice.createCardToken('4242424242424242', 10, 2021,'314').then(result => {
    //   res.send(result);
    // })
    PaymentSesrvice.getCreditCard('tok_1HcCXFLWds26JzlySYOMSbdy').then(result => {
      res.send(result);
    })
  }

  ///paypal payment made from react using react-paypal-express-checkout then call this to save
  async createpaypal(req, res) {
    const { errors, isValid } = validateSubscriberInput(req.body);
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }
    Subscription.findById(subscriptionId)
      .then((result) => {
        const subscriber = new Subscriber({
          breederId: req.user._id,
          description: req.body.description,
          fromDate: Date.now(),
          toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
          subscriptionId: result.subscriptionId,
          allowedEmp: result.allowedEmp,
          allowedAnimal: result.allowedAnimal,
          name: result.name,
          price: result.price,
          currency: result.currency,
          payment_gateway: "paypal",
        });

        /////transaction not delete it is for lof purpose
        const transaction = new Transaction({
          breederId: req.user._id,
          description: req.body.description,
          fromDate: Date.now(),
          toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
          subscriptionId: result.subscriptionId,
          allowedEmp: result.allowedEmp,
          allowedAnimal: result.allowedAnimal,
        });
        transaction.save((err, doc) => {
          if (err)
            return res.json({
              status: 400,
              message: "Subscriber Payment error in transaction",
              errors: err,
              data: {},
            });
        });
        ///////////////

        subscriber.save(async (err, doc) => {
          if (err)
            return res.json({
              status: 400,
              message: "Subscriber Payment error",
              errors: err,
              data: {},
            });

          ///delete older
          await LogicController.SubscriberdeleteFirst(req.user._id);
          ///
          return res.status(200).json({
            status: 200,
            message: "Subscriber Payment made successfully",
            data: doc,
          });
        });
      })
      .catch((err) => {
        return res.json({
          status: 400,
          message: "Error in creating Subscriber (ckeck subscriptionId)",
          errors: err,
          data: {},
        });
      });
  }

  ///stripe payment create
  async createstripe(req, res) {
    const { errors, isValid } = validateSubscriberInput(req.body);
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }
    let { subscriptionId, description } = req.body;

    Subscription.findById(subscriptionId)
      .then((result) =>
        //stripe
        //await stripe.customers.create({source}})
        //.then(customer => stripe.charges.create({
        //    amount:result.price,
        //    currency:result.currency,
        //    customer: customer.id
        //  }))

        //.then(charge =>
        {
          const subscriber = new Subscriber({
            breederId: req.user._id,
            description,
            fromDate: Date.now(),
            toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
            subscriptionId: result.subscriptionId,
            allowedEmp: result.allowedEmp,
            allowedAnimal: result.allowedAnimal,
            name: result.name,
            price: result.price,
            currency: result.currency,
            payment_gateway: "stripe",
            //   price:charge.amount,   email:charge.billing_details.name
            // ,created:charge.created,    currency:charge.currency, customer:charge.customer,
            // brand:charge.payment_method_details.card.brand,  country:charge.payment_method_details.card.country,
          });

          /////transaction not delete it is for lof purpose
          const transaction = new Transaction({
            breederId: req.user._id,
            description,
            fromDate: Date.now(),
            toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
            subscriptionId: result.subscriptionId,
            allowedEmp: result.allowedEmp,
            allowedAnimal: result.allowedAnimal,
          });
          transaction.save((err, doc) => {
            if (err)
              return res.json({
                status: 400,
                message: "Subscriber Payment error in transaction",
                errors: err,
                data: {},
              });
          });
          ///////////////

          subscriber.save(async (err, doc) => {
            if (err)
              return res.json({
                status: 400,
                message: "Subscriber Payment error",
                errors: err,
                data: {},
              });

            ///delete older
            await LogicController.SubscriberdeleteFirst(req.user._id);
            ///
            return res.status(200).json({
              status: 200,
              message: "Subscriber Payment made successfully",
              data: doc,
            });
          });
        }
      )
      .catch((err) => {
        return res.json({
          status: 400,
          message: "Error in creating Subscriber (ckeck subscriptionId)",
          errors: err,
          data: {},
        });
      });
  }

  async subscribeBreeder(req, res, next) {
    try {
      let { subscriptionId } = req.body;

      Subscription.findById(subscriptionId).then((result) => {
        const subscriber = new Subscriber({
          userType: "breeder",
          userId: req.user._id,
          fromDate: new Date(),
          // toDate: new Date(Date.now() +  * 24 * 60 * 60 * 1000),
          toDate: new Date(new Date().setMonth(new Date().getMonth()+1)),
          subscriptionId: subscriptionId,
          payment_gateway: "stripe",
          //   price:charge.amount,   email:charge.billing_details.name
          // ,created:charge.created,    currency:charge.currency, customer:charge.customer,
          // brand:charge.payment_method_details.card.brand,  country:charge.payment_method_details.card.country,
        });


        subscriber.save().then(subscriberResult => {
          return res.status(200).json({
            status: 200,
            message: "Subscriber created successfully",
          });
        }).catch(error => {
          console.log(error);
          return res.json({
            status: 400,
            message: "Error in creating Subscriber",
            errors: err,
            data: {},
          });
        });

      });
    } catch (error) {
      return next(error);
    }
  }



  ///stripe payment create
  async createstripe(req, res) {
    const { errors, isValid } = validateSubscriberInput(req.body);
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }
    let { subscriptionId, description } = req.body;

    Subscription.findById(subscriptionId)
      .then((result) =>
        //stripe
        //await stripe.customers.create({source}})
        //.then(customer => stripe.charges.create({
        //    amount:result.price,
        //    currency:result.currency,
        //    customer: customer.id
        //  }))

        //.then(charge =>
        {
          const subscriber = new Subscriber({
            breederId: req.user._id,
            description,
            fromDate: Date.now(),
            toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
            subscriptionId: result.subscriptionId,
            allowedEmp: result.allowedEmp,
            allowedAnimal: result.allowedAnimal,
            name: result.name,
            price: result.price,
            currency: result.currency,
            payment_gateway: "stripe",
            //   price:charge.amount,   email:charge.billing_details.name
            // ,created:charge.created,    currency:charge.currency, customer:charge.customer,
            // brand:charge.payment_method_details.card.brand,  country:charge.payment_method_details.card.country,
          });

          /////transaction not delete it is for lof purpose
          const transaction = new Transaction({
            breederId: req.user._id,
            description,
            fromDate: Date.now(),
            toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
            subscriptionId: result.subscriptionId,
            allowedEmp: result.allowedEmp,
            allowedAnimal: result.allowedAnimal,
          });
          transaction.save((err, doc) => {
            if (err)
              return res.json({
                status: 400,
                message: "Subscriber Payment error in transaction",
                errors: err,
                data: {},
              });
          });
          ///////////////

          subscriber.save(async (err, doc) => {
            if (err)
              return res.json({
                status: 400,
                message: "Subscriber Payment error",
                errors: err,
                data: {},
              });

            ///delete older
            await LogicController.SubscriberdeleteFirst(req.user._id);
            ///
            return res.status(200).json({
              status: 200,
              message: "Subscriber Payment made successfully",
              data: doc,
            });
          });
        }
      )
      .catch((err) => {
        return res.json({
          status: 400,
          message: "Error in creating Subscriber (ckeck subscriptionId)",
          errors: err,
          data: {},
        });
      });
  }

  //for new breeder (default package)
  async createdefault(req, res, next) {
    let breederId;
    //console.log(req._id)
    if (req.user && req.user._id) {
      breederId = req.user._id;
    } else {
      breederId = req._id;
    }

    Subscription.findOne({ defaultPackage: true })
      .then((result) => {
        const subscriber = new Subscriber({
          breederId,
          fromDate: Date.now(),
          toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
          subscriptionId: result.subscriptionId,
          allowedEmp: result.allowedEmp,
          allowedAnimal: result.allowedAnimal,
          name: result.name,
        });

        /////transaction not delete it is for lof purpose
        const transaction = new Transaction({
          breederId,
          fromDate: Date.now(),
          toDate: Date.now() + result.period * 24 * 60 * 60 * 1000,
          subscriptionId: result.subscriptionId,
          allowedEmp: result.allowedEmp,
          allowedAnimal: result.allowedAnimal,
        });
        transaction.save((err, doc) => {
          if (err) console.log("Subscriber Payment error in transaction", err); //return res.json({  status:400,message:"Subscriber Payment error in transaction", errors:err,data:{} });
        });
        ///////////////

        subscriber.save(async (err, doc) => {
          if (err)
            return res.json({
              status: 400,
              message: "Subscriber default error",
              errors: err,
              data: {},
            });
          ///delete older
          await LogicController.SubscriberdeleteFirst(breederId);
          ///
          console.log("Default Subscriber created");
          //next()
          //return res.status(200).json({status:200,message:"Default Subscriber created made successfully", data:doc});
        });
      })
      .catch((err) => console.log("error", err));
  }

  async getall(req, res) {
    try {
      const feed = await Subscriber.find({});
      return res
        .status(200)
        .json({ status: 200, message: "All Subscribers", data: feed });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Subscribers",
        errors: err,
        data: {},
      });
    }
  }

  async deleteall(req, res) {
    try {
      const feed = await Subscriber.deleteMany({});
      return res.status(200).json({
        status: 200,
        message: "All Subscribers deleted successfully",
        data: feed,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Subscriber",
        errors: err,
        data: {},
      });
    }
  }

  async getbyId(req, res) {
    try {
      const feed = await Subscriber.find({ _id: req.params.id });
      if (feed == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Subscriber", data: feed });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Subscriber",
        errors: err,
        data: {},
      });
    }
  }

  async deletebyId(req, res) {
    try {
      const feed = await Subscriber.deleteOne({ _id: req.params.id });
      return res.status(200).json({
        status: 200,
        message: "Subscriber deleted successfully",
        data: feed,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Subscriber",
        errors: err,
        data: {},
      });
    }
  }

  async getSubscribedPackageOfBreeder(req, res, next) {
    try  {
      const {id} = req.params;
      Subscriber.findOne({userId: id}).sort({createdAt: 1}).then(resultSubscribed  => {
        console.log(resultSubscribed);
        return res.status(200).json({
          status: 200,
          message: "Subscriber found successfully",
          data: resultSubscribed,
        });
      });
    } catch(error) {
      return next(error);
    }
  }

  async updatebyId(req, res) {
    console.log(req.body)
    try {
      req.body.fromDate=new Date()
      req.body.toDate=new Date(new Date().setMonth(new Date().getMonth()+1))
      req.body.type='monthly'
      const feed = await Subscriber.updateOne({ _id: req.params.id }, req.body);
      return res.status(200).json({
        status: 200,
        message: "Subscriber updated successfully",
        data: feed,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Subscriber",
        errors: err,
        data: {},
      });
    }
  }

  async subscribeUser(req, res) {
    console.log("breeder --->", req.user._id);
    const { errors, isValid } = validateSubscriberInput(req.body);
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }

    try {
      const breederpresent = await Subscriber.find({ breederId: req.user._id });
      //console.log("breederpresent --->",breederpresent)
      if (!breederpresent) {
        req.body.breederId = req.user._id;
        const subscriberData = await Subscriber.create(req.body);
        return res.status(200).json({
          status: 200,
          message: "Subscriber created successfully",
          data: subscriberData,
        });
      } else {
        const subscriberUpdate = await Subscriber.findOneAndUpdate(
          { breederId: req.user._id },
          req.body,
          { new: true }
        );
        return res.status(200).json({
          status: 200,
          message: "Subscriber updated successfully",
          data: subscriberUpdate,
        });
      }
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Subscriber",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new SubscriberController();
