const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;
//these are master fields(will change strick to false for more fields add dynamically from formElements)
const AnimalSchema = mongoose.Schema({
    breederId: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    employeeId: [{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }],//taking array here for more employees
    categoryId: {
        type:Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: {
        type:String,minglength: 3,
        maxlength:20 ,required: true 
    },
    age:Number,
    gender:{type: String,
        enum: ["male", "female"]
    },

    color: {
        type:String,minglength: 3,
        maxlength:20 ,required: true 
    },
    birthDate:Date,
    acquired:{type: String,required: true ,
        enum:['purchased','raised','borrowed']
    },
    tag:{type: String,
        enum:['metal','plastic','brisket']
    },
    tattoo:String,
    identificationMark:String,
    notes:String,
    buyer:String,
    seller:String,
    status:{type: String,
        enum:['sold','died','sick','healthy']},
    description:{
        type:String,minglength: 5,
        maxlength:300
    },
    tagType:String,
    registrationNumber:Number,
    country:String,
    breed:String,

    image:[{type:String }],
    video:[{type:String }],

    price:{type:Number,required: true },
    type:{
        type:String,minglength: 3,
        maxlength:30
    },
    location:String,
    qrcodepath:{type:String}
    },
    {
      timestamps: true
    })

//qrcode of animal save
const QRCode = require('qrcode')
AnimalSchema.pre('save', function( next ) {
    const animal = this;
    const dat=Date.now()
    QRCode.toFile(`uploads/qrcode/${this._id}-${dat}.png`, (this._id).toString(), {
    }, function (err) {
        if(err) return next(err);
      //console.log('qrcode done')
    })
    animal.qrcodepath=`uploads/qrcode/${this._id}-${dat}.png`
    next()
});



AnimalSchema.plugin(idvalidator);
const Animal= mongoose.model('Animal', AnimalSchema);

module.exports = { Animal }