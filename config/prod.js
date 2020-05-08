require('dotenv').config()
module.exports = {
    mongoURI:process.env.MONGO_URI,
    Server:process.env.Server,
    mailthrough:process.env.mailthrough,
    
}