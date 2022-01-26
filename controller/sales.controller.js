const { Sale } = require("../models/Sales");
const { Animal } = require("../models/Animal/Animal");
const InvoiceController = require("./invoice.controller");
const AnimalController = require("./animal.controller");
const ProductController = require("./product.controller");
const InstallmentController = require("./installment.controller");
const SaleValidation = require("../validation/sals");
const constant = require("../middleware/constant");
const { User } = require("../models/User");
const { baseImageURL } = require("../config/key");
const mongoose = require("mongoose");

class SalesController {
  constructor() {
    this.getAllBreederList = this.getAllBreederList.bind(this);
    this.getAllBreederListSimple = this.getAllBreederListSimple.bind(this);
    this.getSaleByUser = this.getSaleByUser.bind(this);
  }

  // Manage sales, installment and invoice..

  async saleAnimal(req, res, next) {
    const getRandomId = (min = 0, max = 50000) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num.toString().padStart(5, "0");
    };

    try {
      const {
        buyerId,
        animals,
        installments,
        products,
        amount,
        tax,
        downpayment,
      } = req.body;

      const { errors, isValid, isInstallment } = SaleValidation.validateSales(
        req.body
      );
      console.log(installments);
      if (!isValid)
        return res.json({
          status: 400,
          message: "errors present",
          errors: errors,
        });

      // if (!(animals && animals[0])) {
      //     return res.status(400).send({ status: 400, message: "At least one animal entry required!" });
      // }

      // add sale with animal array
      console.log(amount.subTotal);
      console.log("My Sale is : ");
      console.log({
        sellerRole: req.user.role[0] ? req.user.role[0] : req.user.role,
        sellerId: req.user._id,
        breederId:
          req.user.role[0] === "employee" ? req.user.breederId : req.user._id,
        buyerId,
        tax,
        totalPrice: amount.totalAmount,
        price: amount.subTotal,
        isPaid: false,
        saleUniqueId: getRandomId(),
        animals,
        products,
        isInstallment,
        downpayment,
      });
      const sale = new Sale({
        sellerRole: req.user.role[0] ? req.user.role[0] : req.user.role,
        sellerId: req.user._id,
        breederId:
          req.user.role[0] === "employee" ? req.user.breederId : req.user._id,
        buyerId,
        tax,
        totalPrice: amount.totalAmount,
        discount: amount.discount,
        priceWithoutDiscount: amount.priceWithoutDiscount,
        price: amount.subTotal,
        isPaid: false,
        saleUniqueId: getRandomId(),
        animals,
        products,
        isInstallment,
        downpayment,
      });
      sale
        .save()
        .then((result) => {
          console.log("Sales added Successfully");
          console.log(result);

          // Promise.all([
          // new Promise((resolve, reject) => {
          //     // updatemany animals
          //     console.log('calling update animal after sales')

          // })
          // ])

          AnimalController.updateAnimalAfterSale(
            animals,
            buyerId,
            req.user._id
          ).then(async (resultAnimal) => {
            try {
              await ProductController.updateProductAfterSale(
                products,
                buyerId,
                req.user._id
              );
            } catch {
              console.log("error");
            }
            // Create installment if any..
            console.log("result animal and is installment available");
            console.log(isInstallment);
            if (isInstallment) {
              console.log("in installments ========================== > ");
              // trigger email with installment..
              for (let installment of installments) {
                console.log("installment isss ================= ");
                console.log(installment);
                InstallmentController.addSingleSaleInstallment(
                  result._id,
                  installment
                )
                  .then((resInstallment) => {
                    InvoiceController.addInvoice(
                      "sale",
                      result._id,
                      getRandomId(),
                      buyerId,
                      req.user._id,
                      req.user.role[0] === "employee"
                        ? req.user.breederId
                        : req.user._id,
                      resInstallment._id
                    ).then((resolve) => {
                      return res.status(200).json({
                        status: 200,
                        message: "Sales added successfully",
                      });
                    });
                  })
                  .catch((errorInstallment) => {
                    console.log(errorInstallment);
                    // return res.json({ status: 400, message: "Error in adding installments", errors: errorInstallment, data: {} });
                  });
              }
              return res.status(200).json({
                status: 200,
                message: "Installment and sales added successfully",
              });
            } else {
              // trigger email without installment..

              InvoiceController.addInvoice(
                "sale",
                result._id,
                getRandomId(),
                buyerId,
                req.user._id,
                req.user.role[0] === "employee"
                  ? req.user.breederId
                  : req.user._id
              ).then((resolve) => {
                return res
                  .status(200)
                  .json({ status: 200, message: "Sales added successfully" });
              });
            }
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in Adding Sales",
            errors: error,
            data: {},
          });
        });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  // async saleAnimal(req, res, next) {
  //     const getRandomId = (min = 0, max = 50000) => {
  //         min = Math.ceil(min);
  //         max = Math.floor(max);
  //         const num =  Math.floor(Math.random() * (max - min + 1)) + min;
  //         return num.toString().padStart(5, "0")
  //       };

  //     try {
  //         const { buyerId, animals, installments, amount, tax, downpayment } = req.body;
  //         const {errors, isValid, isInstallment} = SaleValidation.validateSales(req.body);
  //         if(!isValid)  return res.json({ status: 400, message: "errors present", errors: errors });

  //         // if (!(animals && animals[0])) {
  //         //     return res.status(400).send({ status: 400, message: "At least one animal entry required!" });
  //         // }

  //         // add sale with animal array
  //         console.log(amount.subTotal);
  //         const sale = new Sale({
  //             sellerRole: req.user.role[0] ? req.user.role[0] : req.user.role,
  //             sellerId: req.user._id,
  //             breederId: (req.user.role[0] === 'employee') ? req.user.breederId : req.user._id,
  //             buyerId,
  //             tax,
  //             totalPrice: amount.totalPrice,
  //             price: amount.subTotal,
  //             isPaid: false,
  //             saleUniqueId:  getRandomId(),
  //             animals,
  //             isInstallment,
  //             downpayment
  //         });
  //         sale.save().then(result => {
  //             console.log('Sales added Successfully');
  //             console.log(result);

  //             Promise.all([new Promise((resolve, reject) => {
  //                 // create invoice
  //                 console.log('calling Add invoice');
  //                 InvoiceController.addInvoice('sale', result._id, getRandomId(), buyerId, req.user._id,breederId).then(resolve);
  //             }),
  //             new Promise((resolve, reject) => {
  //                 // updatemany animals
  //                 console.log('calling update animal after sales')
  //                 AnimalController.updateAnimalAfterSale(animals, buyerId, req.user._id ).then(resolve);

  //             })
  //             ]).then(([resInvoice, resAnimal]) => {
  //                 // Create installment if any..
  //                 console.log(resAnimal);
  //                 console.log('result animal and is installment available');
  //                 console.log(isInstallment);
  //                 if(isInstallment) {
  //                     // trigger email with installment..
  //                     InstallmentController.addSaleInstallment(resInvoice._id, result._id,  installments).then(resInstallment => {
  //                         return res.status(200).json({ status: 200, message: "Installment and sales added successfully" });
  //                     }).catch(errorInstallment => {
  //                         console.log(errorInstallment);
  //                         return res.json({ status: 400, message: "Error in adding installments", errors: errorInstallment, data: {} });
  //                     })
  //                 } else {
  //                     // trigger email without installment..
  //                     return res.status(200).json({ status: 200, message: "Sales added successfully" });
  //                 }
  //             });
  //         }).catch(error => {
  //             return res.json({ status: 400, message: "Error in Adding Sales", errors: error, data: {} });

  //         });
  //     } catch (error) {
  //         console.log(error);
  //         return next(error);
  //     }
  // }

  getStaticsForUserBreeder(data, id) {
    console.log("in data");
    const result = {
      totalSale: data.length,
      mytotalSale: data.filter((e) => e.sellerId == id).length,
      get mytotalSalePercentage() {
        if (!this.totalSale) return 0;
        return Math.round(
          parseInt(this.mytotalSale * 100) / parseInt(this.totalSale)
        );
      },
      totalAnimals: data.map((e) => e.animals).flat(1),
      totalAnimalsSold: data
        .map((e) => e.animals)
        .flat(1)
        .reduce((acc, cv) => parseInt(cv.quantity) + acc, 0),
      myAnimalsSold: data
        .filter((e) => e.sellerId == id)
        .map((e) => e.animals)
        .flat(1)
        .reduce((acc, cv) => parseInt(cv.quantity) + acc, 0),
      get myAnimalSoldPercentage() {
        if (!this.totalAnimalsSold) return 0;
        return Math.round(
          parseInt(this.myAnimalsSold * 100) / parseInt(this.totalAnimalsSold)
        );
      },
      totalSaleAmount: data.reduce(
        (acc, cv) =>
          acc +
          (parseInt(cv.price) + parseInt(cv.price) * (parseInt(cv.tax) / 100)),
        0
      ),
      myTotalSaleAmount: data
        .filter((e) => e.sellerId == id)
        .reduce(
          (acc, cv) =>
            acc +
            (parseInt(cv.price) +
              parseInt(cv.price) * (parseInt(cv.tax) / 100)),
          0
        ),
      totalAmountReceived: data
        .filter((e) => e.isPaid)
        .reduce(
          (acc, cv) =>
            acc +
            (parseInt(cv.price) +
              parseInt(cv.price) * (parseInt(cv.tax) / 100)),
          0
        ),
      myTotalAmountReceived: data
        .filter((e) => e.sellerId == id)
        .filter((e) => e.isPaid)
        .reduce(
          (acc, cv) =>
            acc +
            (parseInt(cv.price) +
              parseInt(cv.price) * (parseInt(cv.tax) / 100)),
          0
        ),
      get myTotalAmountReceivedPercentage() {
        // console.log('in myTotalAmountReceivedPercentage ');
        // console.log(Math.round((parseInt(this.myTotalAmountReceived*100))));
        // console.log(this.myTotalSaleAmount);
        if (!this.myTotalSaleAmount) return 0;
        return Math.round(
          parseInt(this.myTotalAmountReceived * 100) /
            parseInt(this.myTotalSaleAmount)
        );
      },
    };
    return result;
  }

  getStaticsForUserAdmin(data, animalCount) {
    console.log("in data");
    console.log(animalCount);
    const result = {
      totalSale: data.length,
      get mytotalSalePercentage() {
        // if(!this.totalSale) return 0;
        // return Math.round((parseInt(this.mytotalSale*100))/parseInt(this.totalSale));
        return 0;
      },
      totalAnimals: data.map((e) => e.animals).flat(1),
      totalProducts: data.map((e) => e.products).flat(1),
      totalProductsSold: data
        .map((e) => e.products)
        .flat(1)
        .reduce((acc, cv) => parseInt(cv.quantity) + acc, 0),
      totalAnimalsSold: data
        .map((e) => e.animals)
        .flat(1)
        .reduce((acc, cv) => parseInt(cv.quantity) + acc, 0),
      get myAnimalSoldPercentage() {
        // if(!this.totalAnimals) return 0;
        // return Math.round((parseInt(this.totalAnimalsSold*100))/parseInt(this.totalAnimals));
        return 0;
      },
      totalSaleAmount: data.reduce(
        (acc, cv) =>
          acc +
          (parseInt(cv.price) + parseInt(cv.price) * (parseInt(cv.tax) / 100)),
        0
      ),
      totalAmountReceived: data
        .filter((e) => e.isPaid)
        .reduce(
          (acc, cv) =>
            acc +
            (parseInt(cv.price) +
              parseInt(cv.price) * (parseInt(cv.tax) / 100)),
          0
        ),
      get myTotalAmountReceivedPercentage() {
        if (!this.totalSaleAmount) return 0;
        return Math.round(
          parseInt(this.totalAmountReceived * 100) /
            parseInt(this.totalSaleAmount)
        );
      },
    };
    return result;
  }

  async getSaleByUser(req, res, next) {
    try {
      const { id, breederId } = req.params;
      const { type } = req.query;
      if (type === "breeder") {
        console.log(id);
        Sale.find({ breederId })
          .then((result) => result.map((e) => e.toObject()))
          .then((result) => {
            console.log(result);
            return res.status(200).json({
              status: 200,
              message: "Sales fetched successfully",
              data: this.getStaticsForUserBreeder(result, id),
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Error in fetching Sales",
              errors: error,
            });
          });
      } else if (type === "admin") {
        console.log("admin in else if condition");
        Sale.find({ breederId })
          .then((result) => result.map((e) => e.toObject()))
          .then((result) => {
            console.log(result);
            Animal.find({ breederId }).then((resultAnimals) => {
              return res.status(200).json({
                status: 200,
                message: "Sales fetched successfully",
                data: this.getStaticsForUserAdmin(
                  result,
                  resultAnimals.reduce(
                    (acc, cv) => acc + parseInt(cv.aliveQuantity),
                    0
                  )
                ),
              });
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Error in fetching Sales",
              errors: error,
            });
          });
      }
    } catch (error) {
      return next(error);
    }
  }

  async dashboardSale(req, res, next) {
    try {
      const { breederId } = req.params;
      console.log(breederId);
      console.log("in dashboard sale");
      Sale.aggregate([
        { $match: { breederId: mongoose.Types.ObjectId(breederId) } },
        {
          $lookup: {
            from: "installments",
            localField: "_id",
            foreignField: "salesId",
            as: "installments",
          },
        },
      ]).then((resultSales) => {
        return res.status(200).json({
          status: 200,
          message: "Sales fetched successfully",
          data: resultSales,
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async getGraphData(req, res, next) {
    try {
      console.log(req.query.type);
      const { type } = req.query;
      const { breederId } = req.params;
      console.log(breederId);
      //   if (constant.removeQuote(type) === "custom") {
      let groupQuery = {};
      let matchQuery = {};
      let { startDate, endDate } = req.query;
      console.log(startDate);
      console.log(endDate);

      if (constant.removeQuote(type) === "all") {
        (matchQuery = {
          $match: {
            breederId: mongoose.Types.ObjectId(breederId),
          },
        }),
          (groupQuery = {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              amount: {
                $sum: {
                  $add: [
                    "$price",
                    { $divide: [{ $multiply: ["$price", "$tax"] }, 100] },
                  ],
                },
              },
              date: { $first: "$createdAt" },
              data: { $push: { price: "$price", tax: "$tax" } },
              count: { $sum: 1 },
            },
          });
      } else {
        startDate = new Date(constant.removeQuote(startDate));
        endDate = new Date(constant.removeQuote(endDate) + "T23:23:23.000Z");
        console.log(constant.getDiffDate(startDate, endDate));
        (matchQuery = {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            breederId: mongoose.Types.ObjectId(breederId),
          },
        }),
          (groupQuery = {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              amount: {
                $sum: {
                  $add: [
                    "$price",
                    { $divide: [{ $multiply: ["$price", "$tax"] }, 100] },
                  ],
                },
              },
              date: { $first: "$createdAt" },
              data: { $push: { price: "$price", tax: "$tax" } },
              count: { $sum: 1 },
            },
          });
      }

      // if (constant.getDiffDate(startDate, endDate) >= 10) {
      //   groupQuery = {
      //     $group: {
      //       _id: {
      //         day: { $dayOfMonth: "$createdAt" },
      //         month: { $month: "$createdAt" },
      //         year: { $year: "$createdAt" },
      //       },
      //       amount: {
      //         $sum: {
      //           $add: [
      //             "$price",
      //             { $divide: [{ $multiply: ["$price", "$tax"] }, 100] },
      //           ],
      //         },
      //       },
      //       date: { $first: "$createdAt" },
      //       data: { $push: { price: "$price", tax: "$tax" } },
      //       count: { $sum: 1 },
      //     },
      //   };
      // } else {
      //   groupQuery = {
      //     $project: {
      //       _id: {
      //         day: { $dayOfMonth: "$createdAt" },
      //         month: { $month: "$createdAt" },
      //         year: { $year: "$createdAt" },
      //         saleUniqueId: "$saleUniqueId",
      //       },
      //       amount: {
      //         $add: [
      //           "$price",
      //           { $divide: [{ $multiply: ["$price", "$tax"] }, 100] },
      //         ],
      //       },
      //       price: "$price",
      //       tax: "$tax",
      //       date: "$createdAt",
      //     },
      //   };
      // }
      console.log("Start Date : ", startDate);
      console.log("End Date : ", endDate);
      Sale.aggregate([
        matchQuery,
        groupQuery,
        {
          $sort: { date: 1 },
        },
      ])
        .then((result) => {
          // const mapData = (data) => {
          //   if (constant.getDiffDate(startDate, endDate) >= 10) {
          //     return {...data, name: `${data._id.day} ${constants.months[data._id.month]}`, count: data.amount};
          //   }
          //   else {

          //   }
          // }

          return res.status(200).json({
            status: 200,
            message: "Sales fetched successfully",
            data: result,
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error fetching data",
            errors: error,
            data: {},
          });
        });
      // }
    } catch (error) {
      return res.json({
        status: 400,
        message: "Error fetching data",
        errors: error,
        data: {},
      });
    }
  }

  async getBreederSalesList(breederId) {
    return new Promise((resolve, reject) => {
      Sale.find({ breederId: breederId })
        .then((result) => {
          //console.log("sales-->",result)
          resolve(result.map((r) => r.toObject().buyerId));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getAllBreederSaleList(req, res, next) {
    //console.log("getAllBreederSaleList==>>")
    let breederId;
    try {
      breederId =
        req.user.role[0] === "breeder" ? req.user._id : req.user.breederId;
      Sale.find({ breederId: breederId, buyerId: req.params.buyerId }).then(
        (result) => {
          return res.status(200).json({
            status: 200,
            message: "Sales fetched successfully",
            data: result,
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  async getAllSaleBySellerId(req, res, next) {
    try {
      const { sellerId } = req.params;
      Sale.find({ sellerId })
        .populate("buyerId")
        .then((responseSale) => {
          return res.status(200).json({
            status: 200,
            message: "Sales fetched successfully",
            data: responseSale,
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async getAllBreederList(req, res, next) {
    try {
      const breeerId =
        req.user.role[0] === "breeder" ? req.user._id : req.user.breederId;
      this.getBreederSalesList(breeerId).then((resultSales) => {
        User.aggregate([
          {
            $match: {
              role: "breeder",
              $or: [{ _id: { $in: resultSales } }, { addedBy: breeerId }],
            },
          },
          {
            $group: {
              _id: { $substr: ["$name", 0, 1] },
              detail: { $push: "$$ROOT" },
            },
          },
          { $sort: { _id: 1 } },
        ])
          .then((result) => {
            let detail = result.map((e) => {
              return { [e._id]: e.detail };
            });
            let object = Object.assign({}, ...detail);

            return res.status(200).json({
              status: 200,
              message: "Breeders fetched successfully",
              data: object,
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Error fetching breeder",
              errors: error,
              data: {},
            });
          });
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAllBreederListSimple(req, res, next) {
    try {
      const breeerId =
        req.user.role[0] === "breeder" ? req.user._id : req.user.breederId;
      this.getBreederSalesList(breeerId).then((resultSales) => {
        User.find({
          role: "breeder",
          $or: [{ _id: { $in: resultSales } }, { addedBy: breeerId }],
        })
          .then((result) => {
            return res.status(200).json({
              status: 200,
              message: "Breeders fetched successfully",
              data: result,
            });
          })
          .catch((error) => {
            return res.json({
              status: 400,
              message: "Error fetching breeder",
              errors: error,
              data: {},
            });
          });
      });
    } catch (error) {
      return next(error);
    }
  }

  async getSales(req, res, next) {
    try {
      let { type, time, startDate, endDate } = req.query;
      let query = {};
      if (time && !(time === "all")) {
        startDate = new Date(constant.removeQuote(startDate));
        endDate = new Date(constant.removeQuote(endDate) + "T23:23:23.000Z");
        query = {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        };
      }
      console.log(query);
      const breederId =
        req.user.role[0] === "breeder" ? req.user._id : req.user.breederId;
      if (type === "upcomming") {
        Sale.find({ isPaid: false, breederId: breederId, ...query })
          .sort({ createdAt: -1 })
          .populate("buyerId")
          .then((resultSale) => {
            return res.status(200).json({
              status: 200,
              message: "Sales Found successfully",
              data: resultSale,
            });
          });
      } else if (type === "history") {
        Sale.find({ breederId: breederId, ...query })
          .sort({ createdAt: -1 })
          .populate("buyerId")
          .then((resultSale) => {
            return res.status(200).json({
              status: 200,
              message: "Sales Found successfully",
              data: resultSale,
            });
          });
      } else if (type === "invoice") {
        InvoiceController.getAllInvoiceByBreeder(breederId).then(
          (resultInvoice) => {
            let convertObj = resultInvoice
              .map((e) => e.toObject())
              .map((e1) => ({
                ...e1,
                saleId: {
                  ...e1.saleId,
                  animals: e1.saleId.animals.map((e2) => ({
                    ...e2,
                    animalId: {
                      ...e2.animalId,
                      image: e2.animalId.image
                        ? `${baseImageURL}${e2.animalId.image}`
                        : null,
                    },
                  })),
                  products: e1.saleId.products.map((e3) => ({
                    ...e3,
                    productId: {
                      ...e3.productId,
                      image: e3.productId.image
                        ? `${baseImageURL}${e3.productId.image}`
                        : null,
                    },
                  })),
                },
              }));

            // Sale.populate(resultInvoice, {path: 'saleId.animals.animalId'}).then(finalRes => {
            return res.status(200).json({
              status: 200,
              message: "Sales Invoice Found successfully",
              data: convertObj,
            });
            // })
          }
        );
      } else if (type === "recentlySold") {
        let date = new Date();
        date.setDate(date.getDate() - 7);
        Sale.find({ sellerId: req.user._id, createdAt: { $gt: date } })
          .populate("buyerId")
          .populate("animals.animalId")
          .then((resultSale) => {
            return res.status(200).json({
              status: 200,
              message: "Sales Found successfully",
              data: resultSale,
            });
          });
      } else {
        return res.json({ status: 400, message: "Unknown type", data: {} });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getSaleDetail(req, res, next) {
    try {
      Sale.findById(req.params.id)
        .populate("buyerId")
        .populate("animals.animalId")
        .populate("products.productId")
        .exec()
        .then((resultSale) => resultSale.toObject())
        .then((resultSale) => {
          if (!resultSale.isInstallment)
            return res.status(200).json({
              status: 200,
              message: "Sales Found successfully",
              data: {
                ...{
                  ...resultSale,
                  buyerId: {
                    ...resultSale.buyerId,
                    image: resultSale.buyerId.image
                      ? `${baseImageURL}${resultSale.buyerId.image}`
                      : null,
                  },
                  animals: resultSale.animals.map((e) => ({
                    ...e,
                    animalId: {
                      ...e.animalId,
                      image: e.animalId.image
                        ? `${baseImageURL}${e.animalId.image}`
                        : null,
                    },
                  })),
                  products: resultSale.products.map((e2) => ({
                    ...e2,
                    productId: {
                      ...e2.productId,
                      image: e2.productId.image
                        ? `${baseImageURL}${e2.productId.image}`
                        : null,
                    },
                  })),
                },
              },
            });

          InstallmentController.getSaleIntallment(req.params.id).then(
            (resultInstallment) => {
              return res.status(200).json({
                status: 200,
                message: "Sales Found successfully",
                data: {
                  ...{
                    ...resultSale,
                    buyerId: {
                      ...resultSale.buyerId,
                      image: resultSale.buyerId.image
                        ? `${baseImageURL}${resultSale.buyerId.image}`
                        : null,
                    },
                    animals: resultSale.animals.map((e) => ({
                      ...e,
                      animalId: {
                        ...e.animalId,
                        image: e.image
                          ? `${config.baseImageURL}${e.image}`
                          : null,
                      },
                    })),
                  },
                  installmentData: resultInstallment,
                },
              });
            }
          );
        });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async changePaidStatus(req, res, next) {
    try {
      Sale.findByIdAndUpdate(req.params.id, {
        isPaid: req.body.isPaid,
        // isPaid: req.body.isPaid ? true : false,
      }).then((resultSale) => {
        console.log(resultSale);
        return res
          .status(200)
          .json({ status: 200, message: "Sales status updated successfully" });
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

module.exports = new SalesController();
