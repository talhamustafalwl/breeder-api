require("dotenv").config();

module.exports = {
  mongoURI:
    "mongodb+srv://breeder:GtmwECDdd3sL26N3@breederdb-vruiv.mongodb.net/breeder?retryWrites=true&w=majority",
  // "mongodb+srv://breeder:Lwa12345@cluster0.6wbtp.mongodb.net/breeder?retryWrites=true&w=majority",
  // Server: 'http://192.168.137.36:5000/api',
  // webServer: 'http://192.168.137.36:5000/api',
  // baseAPIUrl: 'http://192.168.137.36:5000/api',
  // baseImageURL: 'http://192.168.137.36:5000/api/uploads/images/',
  // serverURL: 'http://192.168.137.36:5000/api',
  // imageURL: 'http://192.168.137.36:5000/api/uploads/images/form/',
  // baseDocumentURL: 'http://192.168.137.36:5000/api/uploads/documents/',

  // Server: 'http://192.168.100.29:5000/api',
  // webServer: 'http://192.168.100.29:5000/api',
  // baseAPIUrl: 'http://192.168.100.29:5000/api',
  // baseImageURL: 'http://192.168.100.29:5000/api/uploads/images/',
  // serverURL: 'http://192.168.100.29:5000/api',
  // imageURL: 'http://192.168.100.29:5000/api/uploads/images/form/',
  // baseDocumentURL: 'http://192.168.100.29:5000/api/uploads/documents/',

  // Server: 'http://localhost:5000/api',
  // webServer: 'http://localhost:3000',
  // baseAPIUrl: 'http://localhost:5000/api/',
  // baseImageURL: 'http://localhost:5000/api/uploads/images/',
  // serverURL: 'http://localhost:5000/api',
  // imageURL: 'http://localhost:5000/api/uploads/images/form/',
  // baseDocumentURL: 'http://localhost:5000/api/uploads/documents/',

  // Server: 'https://breeder-api.herokuapp.com',
  // webServer: 'https://breeder-dev.herokuapp.com',
  // baseAPIUrl: 'https://breeder-api.herokuapp.com/',
  // baseImageURL: 'https://breeder-api.herokuapp.com/uploads/images/',
  // serverURL: 'https://breeder-api.herokuapp.com',
  // imageURL: 'https://breeder-api.herokuapp.com/uploads/images/form/',
  // baseDocumentURL: 'https://breeder-api.herokuapp.com/uploads/documents/',

  // Server: "http://3.140.247.226/api",
  // webServer: "http://3.140.247.226",
  // baseAPIUrl: "http://3.140.247.226/api/",
  // baseImageURL: "https://logly.us/api/uploads/images/",
  // serverURL: "http://3.140.247.226/api",
  // imageURL: "https://logly.us/api/uploads/images/form/",
  // baseDocumentURL: "http://3.140.247.226/api/uploads/documents/",

  Server: "https://logly.us/api",
  webServer: "https://logly.us",
  baseAPIUrl: "https://logly.us/api/",
  baseImageURL: "https://logly.us/api/uploads/images/",
  serverURL: "https://logly.us/api",
  imageURL: "https://logly.us/api/uploads/images/form/",
  baseDocumentURL: "https://logly.us/api/uploads/documents/",
  basecharityDoc: "https://logly.us/api/uploads/charityDoc/",

  mailthrough: "hello@logly.us",
  mailFeedback: "hello@logly.us",
  sendgridAPIKey: "",

  //stripe client
  //(testing)
  // stripe_publishable: "",
  // stripe_private: "",
  //live
  stripe_publishable: process.env.STRIPE_PUBLISHABLE,
  stripe_private: process.env.STRIPE_PRIVATE,

  //stripe
  // stripe_publishable:"",
  // stripe_private:"",

  //paypal
  paypalId: "",

  paypalSecret: "",

  //Server: 'https://breeder-api.herokuapp.com',
  // Server: 'http://localhost:3000',
  // Server: 'https://breeder-dev.herokuapp.com',
  // baseAPIUrl: 'http://localhost:3000/',

  sendgridAPIKey: process.env.SENDGRID_API_KEY,
};
