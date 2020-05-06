const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const mongoose = require("mongoose");

const routes = require("./routes");

mongoose.set('useCreateIndex', true);
//mongoose
const connect = mongoose
    .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
///

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//for image,qrcode,videos
app.use("/uploads", express.static("uploads"));

//routes


// app.use("/api/users", require("./routes/users"));
app.use(routes);

// app.use((error, req, res) => {
//     res.status(400).send('internal server error');
// })

app.use((error, req, res, next) => {
    console.log('Error is  ======== ', error);
    res.status(400).json({ status: 400, message: 'Internal Server Error' });
});

app.use((req, res, next) => {
    const err = new Error('Resource does not exist');
    // err.status = 404;
    // next(err);
    res.status(404).json({ status: 404, message: 'Resource Not Found' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running at ${port}`);
});