const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const mongoose = require("mongoose");
//mongoose
const connect = mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
///

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//for image display
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/users", require("./routes/users"));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
