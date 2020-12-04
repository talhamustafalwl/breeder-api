const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;
//these are master fields(will change strick to false for more fields add dynamically from formElements)
const healthRecordSchema  = mongoose.Schema({
    filename: String, 
    size: String, 
    type: String,
    addedBy:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true});

const gallerySchema = mongoose.Schema({
    filename: String,
    size: String,
    type: String,
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
},  {timestamps: true})
const AnimalSchema = mongoose.Schema({
    breederId: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },//kis user ne add kiya ha

    // can have only one farm..
    farmId: {
        type: Schema.Types.ObjectId,
        ref: 'Farm',
    }, // in which farm this animal belongs to ..

    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    categoryName: {
        type: String, required: true
    },
    // name: {
    //     type: String, minglength: 3,
    //     maxlength: 20, required: true
    // },
    data: Object,
    family: {parent1: {id : {type: Schema.Types.ObjectId, ref: 'Animal'} }, parent2: {id :  {type: Schema.Types.ObjectId, ref: 'Animal'} },children:[{type: Schema.Types.ObjectId, ref: 'Animal'}]},
    healthRecord: [healthRecordSchema],
    gallery: [gallerySchema],
    status: {
        type: String,
        // No more using these status..
        // enum: ['Sold', 'Alive', 'Dead'],
        default: 'Alive'
    },
    healthStatus:  {
        type: String,
        // No more using these status..
        // enum: ['Sick', 'Healthy', 'Pregnant'],
        default: 'Healthy',
    },
    inventoryStatus: {
        type: String,
        // No more using these status..
        // enum: ['In stock', 'Out of stock'],
        default: 'In stock',  
    },
    age: Number,
    gender: {
        type: String,
        enum: ["male", "female"]
    },

    quantity: {
        type: Number,
        default: 0,
    },
    aliveQuantity: {
        type: Number,
        default: 0,
    },
    soldQuantity:  {
        type: Number,
        default: 0,
    },
    transferQuantity:  {
        type: Number,
        default: 0,
    },
    soldQuantityPending:  {
        type: Number,
        default: 0,
    },
    deadQuantity: {
        type: Number,
        default: 0,
    },
    healthyQuantity: {
        type: Number,
        default: 0,
    },
    sickQuantity: {
        type: Number,
        default: 0,
    },
    pregnantQuantity: {
        type: Number,
        default: 0,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    // color: {
    //     type: String, minglength: 3,
    //     maxlength: 20, required: true
    // },
    birthDate: Date,
    // acquired: {
    //     type: String, required: true,
    //     enum: ['purchased', 'raised', 'borrowed']
    // },
    tag: {
        type: String,
        enum: ['metal', 'plastic', 'brisket']
    },
    tattoo: String,
    identificationMark: String,
    notes: String,
    buyer: [{id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }, quantity: Number, date: Date}],
    seller: [{id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }, quantity: Number, date: Date}],
    transferBreeder: [{id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }, quantity: Number, date: Date}],
    transferBreederReceived: [{id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }, quantity: Number, date: Date}],
    sellerAnimalId : {
        type: Schema.Types.ObjectId,
        ref: 'Animal',
    },
    description: {
        type: String, minglength: 5,
        maxlength: 300
    },
    tagType: String,
    registrationNumber: Number,
    country: String,
    breed: String,
    isPrivate: { type: Boolean, default: false },
    image: String,
    //images:[{type:Schema.Types.ObjectId,ref: 'Image'}],
    //videos:[{type:Schema.Types.ObjectId,ref: 'Video'}],

    price: { type: Number },
    type: {
        type: String, minglength: 3,
        maxlength: 30
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    qrcodepath: { type: String }
},
    {
        timestamps: true
    })

//qrcode of animal save
const QRCode = require('qrcode')
AnimalSchema.pre('save', function (next) {
    console.log('on pre save');
    const animal = this;
    console.log(this);
    const dat = Date.now()
    if(!animal.qrcodepath) {
        QRCode.toFile(`uploads/qrcode/${this._id}-${dat}.png`, [{data: (this._id).toString(), mode: 'byte'}], {
        }, function (err) {
            if (err) return next(err);
            console.log('qrcode done')
            animal.qrcodepath = `uploads/qrcode/${animal._id}-${dat}.png`
            return next()
        })
    } else {
        return next();
    }
  
    
});



// AnimalSchema.statics.saleUpdateAnimal = function (animalArr, cb) {
//     Animal.update({_id: {$in: animalArr.map(e => mongoose.(e._id))}}, {status: 'sold', buyer, seller}).then(result => {
//         resolve(result);
//       });
// } 

AnimalSchema.plugin(idvalidator);
const Animal = mongoose.model('Animal', AnimalSchema);

module.exports = { Animal }