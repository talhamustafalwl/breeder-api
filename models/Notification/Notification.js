const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

//name of Notification (Instead of alarm)
const NotificationSchema = mongoose.Schema({
    title:{type:String},
    description:{type:String,required:true},
    date:{type:Date,default:Date.now()},
    animalId: [{type: Schema.Types.ObjectId,
        ref: 'Animal'}],
    breederId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    employeeId: [{type: Schema.Types.ObjectId,
        ref: 'User'}],

    groupId: [{type: Schema.Types.ObjectId,ref: 'Group'}],//for activityHistory
    
    userId: {type: Schema.Types.ObjectId,
        ref: 'User'},
    locationId: {type: Schema.Types.ObjectId,
        ref: 'Location'},
    type:{type:String,required:true, default: "staffnotification", enum: ["mynotification", "staffnotification"]},
    notificationType: {type:String,required:true, default: "employee", enum: ["breeder", "employee"]},
    notificationSubType: {type:String,required:true, default: "announcement", enum: ["reminder", "announcement"]},
    categoryType: {type:String},//for reminder Activity
    priority:{type:String,required:true,default:"normal",
    enum: ["normal", "urgent","low"]}, 

    addedBy:{type:String,required:true,default:"breeder",
    enum: ["breeder", "admin"],},

    assignToType:{type:String,enum: ["Animal", "Group"],},//for activityHistory
    
    status:{type:String,default:"unread",required:true,
        enum: ["unread", "read","deleted"]},
    isRemoved: {type: Boolean, default: false},

}, { timestamps: true })

NotificationSchema.plugin(idvalidator);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification }