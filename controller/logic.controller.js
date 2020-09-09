const fs = require('fs')
const path = require('path');
const { Subscriber } = require("../models/Subscription/Subscriber");

class LogicController {

    //delete qrcode images
    deleteallqr(req, res, next) {
        //console.log("called deleteallqr")
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


    //delete all images
    deleteallimages(req, res, next) {
        //console.log("called deleteallqr")
        try {
            const directory = 'uploads/images';

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



    //delete all videos
    deleteallvideos(req, res, next) {
        //console.log("called deleteallqr")
        try {
            const directory = 'uploads/videos';

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
        //console.log("qrcode",req.qrcodepath)
        const dir = req.qrcodepath
        console.log(dir);
        try {
            fs.unlinkSync( path.join(__dirname, '../' + dir))
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

        //delete 1 qrcode images
        deleteImg(req, res, next) {
            //console.log("qrcode",req.qrcodepath)
            const dir = req.qrcodepath
            console.log(dir);
            try {
                fs.unlinkSync( path.join(__dirname, '../' + dir))
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    




    async SubscriberdeleteFirst(breederId){   
        await Subscriber.find({breederId}).then(result=> {
           
            if(result.length > 1){
              Subscriber.deleteOne({breederId}).then(data => console.log("Deleted"))
              .catch(err => console.log(""))
            }
        })

        return;
}





};

module.exports = new LogicController();