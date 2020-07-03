const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');


const ProductSchema = mongoose.Schema({
    name: {type: String,required:true},
    description: {type: String,required:true},
    quantity: {type: Number,required:true},
    price: {type: Number,required:true},
    barcodepath:{type:String},
    productId: {type: Schema.Types.ObjectId,
        ref: 'Product'},
    
   //who added this product
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    addedBy: {type: Schema.Types.ObjectId,
        ref: 'User'},
   
}, { timestamps: true })


//qrcode of product(id) save
const QRCode = require('qrcode')
ProductSchema.pre('save', function( next ) {
    const product = this;
    const dat=Date.now()
    QRCode.toFile(`uploads/barcode/${this._id}-${dat}.png`, (this._id).toString(), {
    }, function (err) {
        if(err) return next(err);
      //console.log('qrcode done')
    })
    product.barcodepath=`uploads/barcode/${this._id}-${dat}.png`
    next()
});



ProductSchema.plugin(idvalidator);
const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product }