const { Subscriber } = require("../models/Subscription/Subscriber");
const {
  SubscriptionHistory,
} = require("../models/Subscription/SubscriptionHistory");
const { Subscription } = require("../models/Subscription/Subscription");
const { Transaction } = require("../models/Subscription/Transaction");
const LogicController = require("./logic.controller");
const { validateSubscriberInput } = require("../validation/subscriber");
const config = require("../config/key");
const PaymentSesrvice = require("../misc/payment");
const mnogoose = require("mongoose");
const payment = require("../misc/payment");
const { charge } = require("../misc/payment");
const notificationMessages = require("../config/notificationMessages");
const notificationConfig = require("../config/notificationConfig");
const notificationController = require("./notification.controller");

class SubscriberController {
  constructor() {
    this.subscribeUser = this.subscribeUser.bind(this);
  }

  async initialSubscribeBreeder(breederId, body = {}) {
    console.log(breederId);
    let subscriber;
    return new Promise((resolve, reject) => {
      if (body.mobile) {
        resolve({});
      }

      if (body.packageType && body.packageType == "Business") {
        Subscription.findOne({ _id: body.packageId }).then((result) => {
          console.log(
            result,
            "<<--initialSubscribeBreeder Business",
            body.packageId
          );
          // subscribe package monthly..
          if (body.type !== "yearly") {
            subscriber = new Subscriber({
              userType: "breeder",
              userId: breederId,
              fromDate: new Date(),
              // expire after 15 days
              toDate: new Date(new Date().setDate(new Date().getDate() + 15)),
              subscriptionId: result._id,
              type: body.type, //result.priceMethod !== 'Lifetime' ? 'monthly' : 'lifetime'
              productId: body.productId ? body.productId : "",
              transactionId: body.transactionId ? body.transactionId : "",
              transactionDate: body.transactionDate ? body.transactionDate : "",
              transactionReceipt: body.transactionReceipt
                ? body.transactionReceipt
                : "",
            });
          } else {
            subscriber = new Subscriber({
              userType: "breeder",
              userId: breederId,
              fromDate: new Date(),
              // expire after 15 days
              toDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
              subscriptionId: result._id,
              type: body.type, //result.priceMethod !== 'Lifetime' ? 'monthly' : 'lifetime'
              productId: body.productId ? body.productId : "",
              transactionId: body.transactionId ? body.transactionId : "",
              transactionDate: body.transactionDate ? body.transactionDate : "",
              transactionReceipt: body.transactionReceipt
                ? body.transactionReceipt
                : "",
            });
          }

          subscriber
            .save()
            .then((subscriberResult) => {
              resolve(subscriberResult);
            })
            .catch((error) => {
              reject(error);
            });
        });
      } else if (
        body.packageType &&
        body.packageType === "Charity Organization"
      ) {
        console.log(body, "<<--initialSubscribeBreeder Charity Organization");
        Subscription.findOne({ packageType: body.packageType }).then(
          (result) => {
            console.log(result, "<<--result Charity Organization");
            // subscribe package monthly..
            const subscriber = new Subscriber({
              userType: "breeder",
              userId: breederId,
              fromDate: new Date(),
              toDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 100)
              ),
              // result.priceMethod === 'Lifetime' ? (new Date(new Date().setFullYear(new Date().getFullYear()+100))) :
              //   (new Date(new Date().setMonth(new Date().getMonth()+1))),
              subscriptionId: result._id,
              type: "lifetime",
              // result.priceMethod === 'Lifetime' ? 'lifetime' : 'monthly'
            });

            subscriber
              .save()
              .then((subscriberResult) => {
                resolve(subscriberResult);
              })
              .catch((error) => {
                reject(error);
              });
          }
        );
      } else {
        console.log("<<--initialSubscribeBreeder Default");
        Subscription.findOne({ defaultPackage: true }).then((result) => {
          console.log(result);
          // subscribe package monthly..
          const subscriber = new Subscriber({
            userType: "breeder",
            userId: breederId,
            fromDate: new Date(),
            // toDate: new Date(Date.now() +  * 24 * 60 * 60 * 1000),
            toDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            subscriptionId: result._id,
            type: result.priceMethod !== "Lifetime" ? "monthly" : "lifetime",
          });

          subscriber
            .save()
            .then((subscriberResult) => {
              resolve(subscriberResult);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    });
  }

  async createCard(req, res) {
    // PaymentSesrvice.createCardToken('4242424242424242', 10, 2021,'314').then(result => {
    //   res.send(result);
    // })
    PaymentSesrvice.getCreditCard("tok_1HcCXFLWds26JzlySYOMSbdy").then(
      (result) => {
        res.send(result);
      }
    );
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
          toDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          subscriptionId: subscriptionId,
          payment_gateway: "stripe",
          //   price:charge.amount,   email:charge.billing_details.name
          // ,created:charge.created,    currency:charge.currency, customer:charge.customer,
          // brand:charge.payment_method_details.card.brand,  country:charge.payment_method_details.card.country,
        });

        subscriber
          .save()
          .then((subscriberResult) => {
            return res.status(200).json({
              status: 200,
              message: "Subscriber created successfully",
            });
          })
          .catch((error) => {
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
    try {
      const { id } = req.params;
      Subscriber.findOne({ userId: id })
        .populate("subscriptionId")
        .sort({ createdAt: 1 })
        .then((resultSubscribed) => {
          console.log(resultSubscribed);
          return res.status(200).json({
            status: 200,
            message: "Subscriber found successfully",
            data: resultSubscribed,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async updatebyId(req, res) {
    console.log(req.body);
    try {
      req.body.fromDate = new Date();
      req.body.toDate = req.body.toDate
        ? req.body.toDate
        : new Date(new Date().setMonth(new Date().getMonth() + 1));
      req.body.type = req.body.type ? req.body.type : "monthly";
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

  async chargeForSubscription(subscriptionId, type, creditCardId, customerId) {
    return new Promise(async (resolve, reject) => {
      // console.log(creditCardId,type);
      // console.log('the data to be passed is ', creditCardId, '  and ',  customerId)
      try {
        const subscription = await Subscription.findById(subscriptionId);
        const subscriptionAmount =
          type === "monthly"
            ? subscription.monthlyPrice
            : type === "yearly"
            ? subscription.yearlyPrice
            : subscription.lifetimePrice;
        // const cardToken = await payment.createCardToken(creditCardId, customerId);
        const chargeResult = await payment.charge(
          subscriptionAmount,
          creditCardId,
          customerId,
          "Charge for subscription"
        );
        resolve(chargeResult);
      } catch (error) {
        reject(error);
      }
    });
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
      if (!req.user.creditCard[0])
        return res.json({
          status: 400,
          message: "No card added!",
          data: {},
        });
      const breederpresent = await Subscriber.find({ breederId: req.user._id });
      //console.log("breederpresent --->",breederpresent)
      // console.log('Data for payment   ======== == ');
      // console.log(req.body.subscriptionId, req.body.type, req.user.creditCard[0].card.id, req.user.stripeCustomer.id);
      // console.log(" ========================")
      // Add Payment ..
      const chargeResult = await this.chargeForSubscription(
        req.body.subscriptionId,
        req.body.type,
        req.user.creditCard[0].card.id,
        req.user.stripeCustomer.id
      );
      console.log("Stripe charge result: ");
      console.log(chargeResult);

      if (!breederpresent) {
        console.log(req.body, "<---");
        req.body.userId = req.user._id;
        req.body.fromDate = new Date();
        // toDate: new Date(Date.now() +  * 24 * 60 * 60 * 1000),
        req.body.toDate =
          req.body.type === "monthly"
            ? new Date(new Date().setMonth(new Date().getMonth() + 1))
            : req.body.type === "yearly"
            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            : new Date(new Date().setFullYear(new Date().getFullYear() + 100));
        const subscriberData = await Subscriber.create(req.body);
        SubscriptionHistory({
          ...req.body,
          userId: req.user._id,
          payment: chargeResult,
        }).save();

        console.log("notification in subscription case");
        const notifMessage = notificationMessages.changeSubscription();
        const subdata = {
          title: notifMessage.title,
          description: notifMessage.description,
          notificationType: notificationConfig.notificationType.admin,
          notificationSubType:
            notificationConfig.notificationSubType.announcement,
          type: notificationConfig.type.adminnotification,
          data: {},
        };
        notificationController.sendToAdmin(notifMessage.type, subdata);

        return res.status(200).json({
          status: 200,
          message: "Subscriber created successfully",
          data: subscriberData,
        });
      } else {
        console.log(req.body);
        console.log(req.user._id);
        req.body.fromDate = new Date();
        // toDate: new Date(Date.now() +  * 24 * 60 * 60 * 1000),
        req.body.toDate =
          req.body.type === "monthly"
            ? new Date(new Date().setMonth(new Date().getMonth() + 1))
            : req.body.type === "yearly"
            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            : new Date(new Date().setFullYear(new Date().getFullYear() + 100));

        const subscriberUpdate = await Subscriber.findOneAndUpdate(
          { userId: mnogoose.Types.ObjectId(req.user._id) },
          req.body,
          { new: true }
        );

        SubscriptionHistory.findOneAndUpdate(
          { userId: req.user._id, isActive: true },
          { isActive: false }
        ).then((resultSubscription) => {
          console.log(resultSubscription);
          SubscriptionHistory({
            ...req.body,
            userId: req.user._id,
            payment: chargeResult,
          }).save();
        });

        console.log("notification in subscription case");
        const notifMessage = notificationMessages.changeSubscription();
        const subdata = {
          title: notifMessage.title,
          description: notifMessage.description,
          notificationType: notificationConfig.notificationType.admin,
          notificationSubType:
            notificationConfig.notificationSubType.announcement,
          type: notificationConfig.type.adminnotification,
          data: {},
        };
        notificationController.sendToAdmin(notifMessage.type, subdata);

        return res.status(200).json({
          status: 200,
          message: "Subscriber updated successfully",
          data: subscriberUpdate,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in updating Subscriber",
        errors: err,
        data: {},
      });
    }
  }

  async packagesByCount(req, res) {
    try {
      const feed = await Subscriber.aggregate([
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscriptionId",
            foreignField: "_id",
            as: "package",
          },
        },
        { $unwind: { path: `$package` } },
        {
          $group: {
            _id: `$package.packageType`,
            count: { $sum: 1 },
            detail: { $last: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            packageType: "$_id",
            count: "$count",
          },
        },
      ]);
      let OtherData = [
        "Business Service Provider",
        "Business Listing",
      ].map((e) => ({ packageType: e, count: 0 }));

      return res.status(200).json({
        status: 200,
        message: "Subscribers packages detail",
        data: [...feed, ...OtherData],
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in getting Subscribers",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new SubscriberController();
