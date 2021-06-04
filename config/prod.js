// require('dotenv').config()
// module.exports = {
//     mongoURI:process.env.MONGO_URI,
//     Server:process.env.Server,
//     mailthrough:process.env.mailthrough,

// }
require('dotenv').config();

module.exports = {
  mongoURI: 'mongodb+srv://breeder:GtmwECDdd3sL26N3@breederdb-vruiv.mongodb.net/breeder?retryWrites=true&w=majority',
  //   mongoURI:'mongodb://localhost:27017/breeder_official'


  // Server: 'https://breeder-livewireapps-api.herokuapp.com',
  // webServer: 'https://breeder-dev.herokuapp.com',
  // baseAPIUrl: 'https://breeder-livewireapps-api.herokuapp.com/',
  // baseImageURL: 'https://breeder-livewireapps-api.herokuapp.com/uploads/images/',
  // serverURL: 'https://breeder-livewireapps-api.herokuapp.com',
  // imageURL: 'https://breeder-livewireapps-api.herokuapp.com/uploads/images/form/',
  // baseDocumentURL: 'https://breeder-livewireapps-api.herokuapp.com/uploads/documents/',



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

  // Server: 'http://3.21.129.23/api',
  // webServer: 'http://3.21.129.23',
  // baseAPIUrl: 'http://3.21.129.23/api/',
  // baseImageURL: 'http://3.21.129.23/api/uploads/images/',
  // serverURL: 'http://3.21.129.23/api',
  // imageURL: 'http://3.21.129.23/api/uploads/images/form/',
  // baseDocumentURL: 'http://3.21.129.23/api/uploads/documents/',


  Server: 'https://logly.us/api',
  webServer: 'https://logly.us',
  baseAPIUrl: 'https://logly.us/api/',
  baseImageURL: 'https://logly.us/api/uploads/images/',
  serverURL: 'https://logly.us/api',
  imageURL: 'https://logly.us/api/uploads/images/form/',
  baseDocumentURL: 'https://logly.us/api/uploads/documents/',
  basecharityDoc: 'https://logly.us/api/uploads/charityDoc/',

  mailthrough: 'hello@logly.us',
  mailFeedback: 'hello@logly.us',
  sendgridAPIKey: "", //talha@livewirelabs.co


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

  sendgridAPIKey: process.env.SENDGRID_API_KEY,


  // imageURL: 'http://192.168.88.129:5000/uploads/images/form/',
  // mailthrough: 'admin@breeder.com',
  // baseDocumentURL: 'http://192.168.88.129:5000/uploads/documents/',
  // sendgridAPIKey: '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',


  //Server: 'https://breeder-api.herokuapp.com',
  // Server: 'http://localhost:3000',
  // Server: 'https://breeder-dev.herokuapp.com',
  // baseAPIUrl: 'http://localhost:3000/',

  // sendgridAPIKey: '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',
  // sendgridAPIKey: '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',


}
