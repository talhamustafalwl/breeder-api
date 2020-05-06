const { Element } = require('../models/Form/Element');

class ElementController {
    constructor() { }

    getAllElements(req, res, next) {
        try {
            Element.find().then(elements => {
                return res.status(200).json({ status: 200, message: "Elements found successfully", data: elements });
            }).catch(err => {
                return res.json({ status: 400, message: "Error in finding elements", errors: err, data: {} });
            });
        } catch (err) {
            return next(err);
        }
    }

    addElement(req, res, next) {
        try {
            const element = new Element(req.body);
            element.save().then(result => {
                return res.status(200).json({ status: 200, message: "Elements added successfully", data: result });
            }).catch(err => {
                return res.json({ status: 400, message: "Error in adding elements", errors: err, data: {} });
            })
        } catch (err) {
            return next(err);
        }
    }

    async modifyElement(req, res, nex) {
        try {
            const { id } = req.params;
            console.log(id);
            if (!id) return res.json({ status: 400, message: "Id parameter is required", data: {} });
            console.log(req.body);
            const element = await Element.findOneAndUpdate({ _id: id }, req.body).catch(err => {
                console.log(err);
                return res.json({ status: 400, message: "Error in modifying elements", errors: err, data: {} });
            });
            console.log(element);
            return res.status(200).json({ status: 200, message: "Elements modified successfully", data: element });
        } catch (err) {
            return next(err);
        }
    }

}


module.exports = new ElementController();