const { Sale } = require('../models/Contact/Sales');
const InvoiceController = require('./invoice.controller');
const AnimalController = require('./animal.controller');
const InstallmentController = require('./installment.controller');
const SaleValidation = require('../validation/sals');
class SalesController {

    async saleAnimal(req, res, next) {
        try {
            const { contactId, animals, installments, amount, isPaid } = req.body;
            const {errors, isValid, isInstallment} = SaleValidation.validateSales(req.body);
            if(!isValid)  return res.json({ status: 400, message: "errors present", errors: errors });
            
            // if (!(animals && animals[0])) {
            //     return res.status(400).send({ status: 400, message: "At least one animal entry required!" });
            // }
            console.log( req.body.animals.map(e => e.price).reduce((a, b) => a + b, 0));
            if (!(amount === req.body.animals.map(e => e.price).reduce((a, b) => a + b, 0))) {
                return res.status(400).send({ status: 400, message: "Total amount is not matched with animal price!" });
            }
            // add sale with animal array
            const sale = new Sale({ ...{ sellerRole: req.user.role, sellerId: req.user._id, isInstallment }, ...req.body })
            sale.save().then(result => {
                console.log('Sales added Successfully');
                console.log(result);
                Promise.all([new Promise((resolve, reject) => {
                    // create invoice 
                    InvoiceController.addInvoice(contactId, 'sale', result._id, animals).then(resolve)
                }),
                new Promise((resolve, reject) => {
                    // updatemany animals
                    AnimalController.updateAnimalAfterSale(animals,contactId, req.user._id ).then(resolve);
                    
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
            return next(error);
        }
    }
}

 module.exports  = new SalesController();