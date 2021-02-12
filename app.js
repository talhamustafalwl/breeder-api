const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config()
const routes = require("./routes");

mongoose.set('useCreateIndex', true);
//mongoose
const connect = mongoose
    .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
///


Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

//for frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}
///
app.use(cors());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



//for image,qrcode,videos
app.use("/api/uploads", express.static("uploads"));

//routes
app.use((req, res,next) => {
    console.log(req.originalUrl)
    next();
})

// app.use("/api/users", require("./routes/users"));
app.use('/api', routes);

// app.use((error, req, res) => {
//     res.status(400).send('internal server error');
// })

app.use((error, req, res, next) => {
    console.log('Error is  ======== ', error);
    res.json({ status: 400, message: error.message ? error.message : 'Internal Server Error' });
});

app.use((req, res, next) => {
    const err = new Error('Resource does not exist');
    // err.status = 404;
    // next(err);
    console.log(req.originalUrl)
    res.status(404).json({ status: 404, message: 'Resource Not Found' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running at ${port}`);
});