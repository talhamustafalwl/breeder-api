
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('on multer destination');
        cb(null, __dirname + '/../uploads/images')
        // cb(null, __dirname + '/../uploads/csvFiles');
    },
    filename: (req, file, cb) => {
      console.log('on multer filename');
        cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        //return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
   })

   module.exports=upload