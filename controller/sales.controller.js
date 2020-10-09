const { Sale } = require('../models/Sales');
const InvoiceController = require('./invoice.controller');
const AnimalController = require('./animal.controller');
const InstallmentController = require('./installment.controller');
const SaleValidation = require('../validation/sals');

class SalesController {



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
            const sale = new Sale({ 
                sellerRole: req.user.role[0] ? req.user.role[0] : req.user.role, 
                sellerId: req.user._id, 
                buyerId,
                tax,
                totalPrice: amount.totalPrice,
                price: amount.subTotal,
                isPaid: false,
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
                    InvoiceController.addInvoice('sale', result._id, '0000').then(resolve);
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


    async getSales(req, res, next) {
        try {
            
        } catch(error) {    
            console.log(error);
            return next(error);
        }
    }
}

 module.exports  = new SalesController();