const fs = require('fs')
const path = require('path');

class AnimalController {
    constructor() { }


    //delete qrcode images
    deleteallqr(req, res, next) {
        try {
            const directory = 'uploads/qrcode';

            fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                });
            }
            });
        } catch (err) {
            return next(err);
        }
    }

     //delete 1 qrcode images
     deleteqr(req, res, next) {
         console.log(req.qrcodepath)
        const path = req.qrcodepath
        try {
            fs.unlinkSync(path)
        } catch (err) {
            return next(err);
        }
    }


};

module.exports = new AnimalController();