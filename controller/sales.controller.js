const { Sale } = require('../models/Sales');
const InvoiceController = require('./invoice.controller');
const AnimalController = require('./animal.controller');
const InstallmentController = require('./installment.controller');
const SaleValidation = require('../validation/sals');
const { User } = require("../models/User");

class SalesController {

    constructor() {
        this.getAllBreederSaleList = this.getAllBreederSaleList.bind(this);
    }

    // Manage sales, installment and invoice.. 

    async saleAnimal(req, res, next) {
        try {
            const { buyerId, animals, installments, amount, tax, downpayment } = req.body;
            const {errors, isValid, isInstallment} = SaleValidation.validateSales(req.body);
            if(!isValid)  return res.json({ status: 400, message: "errors present", errors: errors });
            
            // if (!(animals && animals[0])) {
            //     return res.status(400).send({ status: 400, message: "At least one animal entry required!" });
            // }

            // add sale with animal array
            console.log(amount.subTotal);
            const sale = new Sale({ 
                sellerRole: req.user.role[0] ? req.user.role[0] : req.user.role, 
                sellerId: req.user._id, 
                buyerId,
                tax,
                totalPrice: amount.totalPrice,
                price: amount.subTotal,
                isPaid: false,
                saleUniqueId: '0000F',
                animals,
                isInstallment, 
                downpayment
            });
            sale.save().then(result => {
                console.log('Sales added Successfully');
                console.log(result);
                Promise.all([new Promise((resolve, reject) => {
                    // create invoice 
                    console.log('calling Add invoice');
                    InvoiceController.addInvoice('sale', result._id, '0000', buyerId, req.user._id).then(resolve);
                }),
                new Promise((resolve, reject) => {
                    // updatemany animals
                    console.log('calling update animal after sales')
                    AnimalController.updateAnimalAfterSale(animals, buyerId, req.user._id ).then(resolve);
                    
                })
                ]).then(([resInvoice, resAnimal]) => {
                    // Create installment if any..
                    console.log(resAnimal);
                    if(isInstallment) {
                        // trigger email with installment..
                        InstallmentController.addSaleInstallment(resInvoice._id, result._id,  installments).then(resInstallment => {
                            return res.status(200).json({ status: 200, message: "Installment and sales added successfully" });
                        }).catch(errorInstallment => {
                            console.log(errorInstallment);
                            return res.json({ status: 400, message: "Error in adding installments", errors: errorInstallment, data: {} });
                        })
                    } else {
                        // trigger email without installment..
                        return res.status(200).json({ status: 200, message: "Sales added successfully" });                        
                    }
                });
            }).catch(error => {
                return res.json({ status: 400, message: "Error in Adding Sales", errors: error, data: {} });

            });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    async getBreederSalesList(breederId) {
        return new Promise((resolve, reject) => {
            Sale.find({sellerId: breederId}).then(result => {
                resolve(result.map(r => r.toObject().buyerId));
            }).catch(error => {
                reject(error);
            });
        });
    }


    async getAllBreederSaleList (req, res, next) {
        try {
            const breeerId = (req.user.role[0] === 'breeder') ? req.user._id : req.user.breederId;
            this.getAllBreederSaleList(breeerId).then(resultSales => {
                User.find({role: 'breeder', _id: {$in: resultSales}}).then(result => {
                    return res.status(200).json({ status: 200, message: "Breeder found successfully", data: result.map(e => ({...e.toObject(), ...{image:  e.toObject().image ? `${config.baseImageURL}${e.toObject().image}`: null}})) });
                }).catch(error => {
                    return res.json({ status: 400, message: "Error fetching breeder", errors: error, data: {} });
                });
            });
         } catch(error) {
            return next(error);
        }
    }


    async getSales(req, res, next) {
        try {
            const { type } = req.query;
            if(type === 'upcomming') {
                Sale.find({isPaid: false, sellerId: req.user._id, }).populate('buyerId').then(resultSale => {
                    return res.status(200).json({ status: 200, message: "Sales Found successfully", data: resultSale });                        
                });
            } else if(type === 'history') {
                Sale.find({ sellerId: req.user._id, }).populate('buyerId').then(resultSale => {
                    return res.status(200).json({ status: 200, message: "Sales Found successfully", data: resultSale });                        
                });
            } else if(type === 'invoice') {
                InvoiceController.getAllInvoiceByBreeder(req.user._id).then(resultInvoice => {
                    // Sale.populate(resultInvoice, {path: 'saleId.animals.animalId'}).then(finalRes => {
                        return res.status(200).json({ status: 200, message: "Sales Invoice Found successfully", data: resultInvoice });                        
                    // })
                })
            } else if(type === 'recentlySold') {
                let date = new Date();
                date.setDate(date.getDate()-7);
                Sale.find({ sellerId: req.user._id, createdAt: {$gt: date} }).populate('buyerId').populate('animals.animalId').then(resultSale => {
                    return res.status(200).json({ status: 200, message: "Sales Found successfully", data: resultSale });                        
                });
            } else {
                return res.json({ status: 400, message: "Unknown type", data: {} });
            }
        } catch(error) {    
            console.log(error);
            return next(error);
        }
    }


    async getSaleDetail(req, res, next) {
        try {
            Sale.findById(req.params.id).populate('buyerId').populate('animals.animalId').exec().then(resultSale => resultSale.toObject()).then(resultSale => {
                if(!resultSale.isInstallment)  
                return res.status(200).json({ status: 200, message: "Sales Found successfully", data: resultSale });                        
                
                InstallmentController.getSaleIntallment(req.params.id).then(resultInstallment => {
                    return res.status(200).json({ status: 200, message: "Sales Found successfully", data: {...resultSale, installmentData: resultInstallment} });                        
                });
           
            });
        } catch(error) {
            console.log(error);
            return next(error);
        }
    }


    async changePaidStatus(req, res, next) {
        try {
            Sale.findByIdAndUpdate(req.params.id, {isPaid: req.body.isPaid ? true: false}).then(resultSale => {
                console.log(resultSale);
                return res.status(200).json({ status: 200, message: "Sales status updated successfully" });        
            });
        } catch(error) {
            console.log(error);
            return next(error);
        }
    }
}

 module.exports  = new SalesController();