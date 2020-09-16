// require('dotenv').config()
// module.exports = {
//     mongoURI:process.env.MONGO_URI,
//     Server:process.env.Server,
//     mailthrough:process.env.mailthrough,
    
// }

module.exports = {
    mongoURI: 'mongodb+srv://breeder:GtmwECDdd3sL26N3@breederdb-vruiv.mongodb.net/breeder?retryWrites=true&w=majority'
    //   mongoURI:'mongodb://localhost:27017/breeder_official'
    , //Server: 'https://breeder-api.herokuapp.com',
    Server: 'http://localhost:3000',
    mailthrough: 'admin@breeder.com',
    imageURL: 'https://breeder-api.herokuapp.com/uploads/images/form/',
    baseImageURL: 'https://breeder-api.herokuapp.com/uploads/images/',
    baseDocumentURL: 'https://breeder-api.herokuapp.com/uploads/documents/',

    //stripe
    stripe_publishable:"pk_test_4UM0NJail2U84LTdxbWH90GH00BcqCrNYn",
    stripe_private:"sk_test_Cozb0IU8FFmiHpepGUVqQCUM00gNg0NJRk",

    //paypal
    paypalId:"",
    paypalSecret:"",
}