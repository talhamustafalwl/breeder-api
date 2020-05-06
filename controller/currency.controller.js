const { currency } = require('../models/Currency');
class CurrencyController {
    constructor() { }
    getAllCurrencies(req, res, next) {
        try {
            currency.find().then(result => {
                return res.status(200).json({ status: 200, message: "Currency found successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error in getting the currencies", errors: error, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }


    getCurrencyById(req, res, next) {
        try {
            currency.findById(req.params.id).then(result => {
                return res.status(200).json({ status: 200, message: "Currency found successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: "Error in getting the currency", errors: error, data: {} });
            });
        } catch (err) {

        }
    }

    addCurrency(req, res, next) {
        try {
            console.log('adding currency');
            const Currency = new currency(req.body);
            Currency.save().then(result => {
                return res.status(200).json({ status: 200, message: "Currency added successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: error.message ? error.message : "Error in adding the currency", errors: error, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }

    updateCurrency(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) return res.json({ status: 400, message: "Id param is required", data: {} });

            currency.updateOne({ _id: id }, req.body).then(result => {
                return res.status(200).json({ status: 200, message: "Currency updated successfully", data: result });
            }).catch(error => {
                return res.json({ status: 400, message: error.message ? error.message : "Error in updating the currency", errors: error, data: {} });
            })

        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new CurrencyController();