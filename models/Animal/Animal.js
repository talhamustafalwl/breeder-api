const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;
//these are master fields(will change strick to false for more fields add dynamically from formElements)
const AnimalSchema = mongoose.Schema({
    breederId: {
        type:Schema.Types.ObjectId,
        ref: 'User',required:true
    },

    addedBy: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },//kis user ne add kiya ha
    
    // can have only one farm..
    farmId: {
        type: Schema.Types.ObjectId,
        ref: 'Farm',
        required: true,
    }, // in which farm this animal belongs to ..
    
    categoryId: {
        type:Schema.Types.ObjectId,
        ref: 'Category'
    },
    categoryName: {
        type:String,required:true
    },
    name: {
        type:String,minglength: 3,
        maxlength:20 ,required: true 
    },
    data: Object,
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
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
    },
    seller:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
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
    isPrivate: {type: Boolean, default: false},
    //images:[{type:Schema.Types.ObjectId,ref: 'Image'}],
    //videos:[{type:Schema.Types.ObjectId,ref: 'Video'}],

    price:{type:Number},
    type:{
        type:String,minglength: 3,
        maxlength:30
    },
    locationId: {
        type:Schema.Types.ObjectId,
        ref: 'Location'
    },
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



// AnimalSchema.statics.saleUpdateAnimal = function (animalArr, cb) {
//     Animal.update({_id: {$in: animalArr.map(e => mongoose.(e._id))}}, {status: 'sold', buyer, seller}).then(result => {
//         resolve(result);
//       });
// } 

AnimalSchema.plugin(idvalidator);
const Animal= mongoose.model('Animal', AnimalSchema);

module.exports = { Animal }