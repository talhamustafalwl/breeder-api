//const { Animal } = require('../models/Animal/Animal');

let deleteallqr = (req, res, next) =>{
    console.log("called deleteallqr")
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
};

module.exports = { deleteallqr };