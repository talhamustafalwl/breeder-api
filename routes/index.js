const express = require("express");
const app = express();
const userRoute = require("./users.js");
const animalRoute = require("./animals");
const statusRoute = require("./status"); //animal status
const categoryRoute = require("./categories");
const imageRoute = require("./images");
const videoRoute = require("./videos");
const unitRoute = require("./units"); //units of feed (kg,gm...)
const designationRoute = require("./designations"); //designations of employee
const farmRoute = require("./farms"); //designations of employee
const feedRoute = require("./feeds"); //feeds
const feedAnimalRoute = require("./feedanimals"); //feed of animal
const feedHistoryRoute = require("./feedhistory"); //feedHistory of animal
const rotationRoute = require("./rotation");
const noteRoute = require("./notes");
const cleaningRoute = require("./cleaning");
const cleaninganimalRoute = require("./cleaninganimal");
const vacinationRoute = require("./vacination");
const vacinationanimalRoute = require("./vacinationanimal");
const healthRoute = require("./health");
const subscriptionRoute = require("./subscription");
const subscriberRoute = require("./subscriber");
const transactionRoute = require("./transaction");
const currencyRoute = require("./currency");
const businessRoute = require("./business");
const invoiceRoute = require("./invoice");
const invoiceitemRoute = require("./invoiceitem");
const installmentRoute = require("./installment");
const groupRoute = require("./groups");
const grouplogRoute = require("./grouplogs");
const relationRoute = require("./relation");
const productRoute = require("./product");

const formRoute = require("./form");
const elementRoute = require("./elements");

const stateRoute = require("./states");
const cityRoute = require("./cities");
const zipcodeRoute = require("./zipcodes");
const locationRoute = require("./locations");
const notificationRoute = require("./notifications");
const activityRoute = require("./activity");
const activityHistoryRoute = require("./activityHistory");
const feedbackRoute = require("./feedback");
const businessDetailRoute = require("./businessDetail");

const searchRoute = require("./search");

app.use("/businessDetails", businessDetailRoute);
app.use("/search", searchRoute);
app.use("/user", userRoute);
app.use("/animal", animalRoute);
app.use("/status", statusRoute); //animl status
app.use("/category", categoryRoute);
app.use("/video", videoRoute);
app.use("/image", imageRoute);
app.use("/unit", unitRoute);
app.use("/designation", designationRoute);
app.use("/farm", farmRoute);
app.use("/currency", currencyRoute);
// Form routes..
app.use("/form", formRoute);
app.use("/element", elementRoute);
app.use("/feed", feedRoute);
app.use("/feedanimal", feedAnimalRoute);
app.use("/feedhistory", feedHistoryRoute);
app.use("/rotation", rotationRoute);
app.use("/note", noteRoute);
app.use("/cleaning", cleaningRoute);
app.use("/cleaninganimal", cleaninganimalRoute);
app.use("/vacination", vacinationRoute);
app.use("/vacinationanimal", vacinationanimalRoute);
app.use("/health", healthRoute); //for health of animal
app.use("/subscription", subscriptionRoute); //admin
app.use("/subscriber", subscriberRoute);
app.use("/transaction", transactionRoute); //admin
app.use("/business", businessRoute);
app.use("/invoice", invoiceRoute);
app.use("/invoiceitem", invoiceitemRoute);
app.use("/installment", installmentRoute);
app.use("/group", groupRoute);
app.use("/grouplog", grouplogRoute);
app.use("/relation", relationRoute); //animal relationship create
app.use("/product", productRoute);

app.use("/contact", require("./contact"));
app.use("/sale", require("./sale"));
app.use("/state", stateRoute);
app.use("/city", cityRoute);
app.use("/zipcode", zipcodeRoute);
app.use("/location", locationRoute);
app.use("/notification", notificationRoute);

app.use("/activity", activityRoute);
app.use("/activityHistory", activityHistoryRoute);
app.use("/feedback", feedbackRoute);
module.exports = app;
