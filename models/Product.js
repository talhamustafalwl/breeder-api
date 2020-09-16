const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var idvalidator = require("mongoose-id-validator");

const gallerySchema = mongoose.Schema(
  {
    filename: String,
    size: String,
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
  },
  { timestamps: true }
);
const ProductSchema = mongoose.Schema(
  {
    // name: {type: String,required:true},
    // description: {type: String,required:true},
    inventoryStatus: {
      type: String,
      enum: ["In stock", "Out of stock"],
      default: "In stock",
    },
    // model: {type: Number,required:true},
    // price: {type: Number,required:true},
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    categoryName: {
      type: String,
      required: true,
    },
    data: Object,
    gallery: [gallerySchema],

    // productId: {type: Schema.Types.ObjectId,
    //     ref: 'Product'},
    // Images:{type: Array},

    //who added this product
    breederId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, //kis user ne add kiya ha
    image: String,

    qrcodepath: { type: String },
    status: { type: String },
  },
  { timestamps: true }
);

// const QRCode = require('qrcode')
// ProductSchema.pre('save', function( next ) {
//     const product = this;
//     const dat=Date.now()
//     QRCode.toFile(`uploads/barcode/${this._id}-${dat}.png`, (this._id).toString(), {
//     }, function (err) {
//         if(err) return next(err);
//       //console.log('qrcode done')
//     })
//     product.barcodepath=`uploads/barcode/${this._id}-${dat}.png`
//     next()
// });

const QRCode = require('qrcode')
ProductSchema.pre('save', function (next) {
    const product = this;
    console.log(this);
    const dat = Date.now()
    QRCode.toFile(`uploads/qrcode/${this._id}-${dat}.png`, [{data: (this._id).toString(), mode: 'byte'}], {
    }, function (err) {
        if (err) return next(err);
        console.log('qrcode done')
        product.qrcodepath = `uploads/qrcode/${product._id}-${dat}.png`
        return next()
    })
    
});

ProductSchema.plugin(idvalidator);
const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
