require('dotenv').config();


module.exports = {
  mongoURI: 'mongodb+srv://breeder:GtmwECDdd3sL26N3@breederdb-vruiv.mongodb.net/breeder?retryWrites=true&w=majority',
  //   mongoURI:'mongodb://localhost:27017/breeder_official'


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
  sendgridAPIKey: "", 


  //stripe client
  stripe_publishable:"pk_test_51HTqUUDSV0RVB4KthKfXU6b74hn0xro39yxQbGoMu1w08xKm8E49OP34UetgyPPLAfa8BHoe7d918DZhj817Fc5100A95mfU1a",
  stripe_private:"sk_test_51HTqUUDSV0RVB4Ktx1KskzuEF3RVBgpJJKr3ibua0x5MleB6XvZBltXEkfI3ZCZl4GksfPJdHkIHOrsUYkeahpzD00GBr50ZBw",

  //stripe
  // stripe_publishable:"pk_test_4UM0NJail2U84LTdxbWH90GH00BcqCrNYn",
  // stripe_private:"sk_test_Cozb0IU8FFmiHpepGUVqQCUM00gNg0NJRk",

   //bilala stripe
  // stripe_publishable:"pk_test_vOI473IHWLLEl6IQ73qKWBz300ozyFfbRC",
  // stripe_private:"sk_test_aE7yn2txmt6mpnDuYA25u7HV00ip4LqW7g",


  //paypal
  paypalId:"",
  
  paypalSecret:"",



  //Server: 'https://breeder-api.herokuapp.com',
  // Server: 'http://localhost:3000',
  // Server: 'https://breeder-dev.herokuapp.com',
  // baseAPIUrl: 'http://localhost:3000/',

  sendgridAPIKey: process.env.SENDGRID_API_KEY,


}
