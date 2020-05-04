const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//name of Notification
const NotificationSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    date:{type:Date},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},

    active:{type:Boolean},
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'}
}, { timestamps: true })

NotificationSchema.plugin(idvalidator);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification }