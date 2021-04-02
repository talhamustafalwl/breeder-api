const {
  sendMessage,
  sendBulkMessage,
  sendSingleMessage,
  sendSingleMessage2
} = require("../misc/fcm");
const { Notification } = require("../models/Notification/Notification");
const { User } = require("../models/User");
const mongoose = require("mongoose");
const { Expo } = require("expo-server-sdk");
const { validateNotificationInput } = require("../validation/notification");
const userController = require("./user.controller");
const moment = require("moment");
const cron = require("node-cron");
const { Activity } = require("../models/Activity/Activity");
const { ActivityHistory } = require("../models/Activity/ActivityHistory");
const { query } = require("express");

async function getDayFunc() {
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";

  var n = weekday[d.getDay()];
  return n;
}

async function getMonthFunc() {
  var d = new Date();
  var month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "July";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  var n = month[d.getMonth()];
  return n;
}

async function calDateDiff(time, timePeriod) {
  let create = false;
  let date = new Date();
  let tp = timePeriod === "A.M" ? "am" : "pm";
  time.map((e) => {
    var startTime = moment(
      `${date.getHours()}:${date.getMinutes()} pm`,
      "HH:mm a"
    );
    var endTime = moment(`${e} ${tp}`, "HH:mm a");

    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) % 60;
    //console.log(hours + ' hour and '+ minutes+' minutes.')
    if (hours === 0 && minutes >= 0 && minutes < 11) {
      console.log("create==>", hours + " hour and " + minutes + " minutes.");
      // create = true;
      create = minutes;
    }
  });
  return create;
}

async function ReminderNotificationCheck(data) {
  let create,
    date = new Date();
  switch (data.period) {
    case "Yearly":
      if (!data.years.includes(date.getFullYear())) {
        console.log("year not matched");
        return false;
      }
    case "Montly":
      let month = await getMonthFunc();
      if (!data.months.includes(month)) {
        console.log("month not matched");
        return false;
      }

    case "Weekly":
      let day = await getDayFunc();
      if (!data.days.includes(day)) {
        console.log("week not matched");
        return false;
      }
    case "Daily":
    case "Once":
      create = await calDateDiff(data.time, data.timePeriod);
      console.log("===>>>>", create, "==>>", data._id);
      return create;
    default:
      return false;
  }
}

cron.schedule("*/15 * * * *", async () => {
  let create;
  let obj = new NotificationController();
  console.log("running a task every 15 min", new Date());
  try {
    let data = await Activity.find({})
      .populate("employeeId", "deviceToken")
      .populate("groupId", "employees animals");
    if (data.length > 0) {
      data.map(async (e) => {
        create = await ReminderNotificationCheck(e);
        //console.log(create)
        if (create) {
          e.remainingTime=create
          obj.reminderNotificationUpdated(e);
        }
      });
    }
  } catch {
    console.log("error");
  }
});

class NotificationController {
  constructor() {
    this.createNotif = this.createNotif.bind(this);
    this.create = this.create.bind(this);
    this.createMultiple = this.createMultiple.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.sendToAllBreeders = this.sendToAllBreeders.bind(this);
    this.addNotificationUpdated = this.addNotificationUpdated.bind(this);
    this.sendToAdmin = this.sendToAdmin.bind(this);
  }

  transformData(data) {
    //console.log(data);
    return {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: data,
      // collapse_key: 'your_collapse_key',
      notification: {
        title: data.title,
        body: data.description,
      },
      data: data.data,
    };
  }

  async create(data, isPush) {
    // const d = {
    //   deviceToken,
    //   title,
    //   description,
    //   data,
    //   userId,
    //   breederId,
    //   notificationType,
    //   animalIdoremployeeId,
    // }
    return new Promise(async (resolve, reject) => {
      if (isPush && data.token) sendSingleMessage(data);
      // resolve(true);
      const notifications = await new Notification(data);
      await notifications
        .save()
        .then((resultNotification) => {
          resolve(resultNotification);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async createMultiple(data, isPush) {
    console.log('inside create multiple')
    return new Promise(async (resolve, reject) => {
      if (isPush)
        sendBulkMessage(
          data.map((e) => ({
            token: e.deviceToken,
            title: e.title,
            description: e.description,
            data: e.data && Object.keys(e => e.length > 0) ? e.data : e,
            isPush: true,
          }))
        );
      try {
        console.log(data[0]);
        if(data[0]) {
          delete data[0]._id;
          const notification = await new Notification({
            ...data[0],
            breedersId: data.map(e => e.breederId),
          });
          const doc = await notification.save();  
          resolve(doc);
        } else {
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async sendToAdmin(type, data) {
    return new Promise(async (resolve, reject) => {
      User.findOne({isAdmin: true}).then(async resultUser => {
        if(resultUser) {
          console.log('Admin is available === ');
          console.log(resultUser.notificationSettings[type]);
          if(resultUser.notificationSettings[type]) {
            console.log(data);
            sendSingleMessage({token: resultUser.deviceToken, data});
          }
          try {
              const notification = await new Notification({
               ...data,
               userId: resultUser._id,
              });
              const doc = await notification.save();  
              resolve(doc);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }


  async sendToAllBreeders(param, ) {
    return new Promise((resolve,reject) => {
      console.log('sending to all breeders');
      User.find({  role: "breeder" })
      .then((allBreeders) => {
        console.log('all breeders are  ');

        const data = allBreeders
          .map((e) => e.toObject())
          .map((e) => ({
            ...e,
            title: param.title,
            description: param.description,
            userId: e._id,
            breederId: e._id,
            notificationType: param.notificationType,
            notificationSubType: param.notificationSubType,
            data: {},
          }));
        
        this.createMultiple(data, true)
          .then((resultNotif) => {
            return resolve({
              status: 200,
              message: "Notification created successfully",
            });
          })
          .catch((error) => {

            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    })
  }

  async NotifTest() {
    return new Promise(async (resolve, reject) => {
      sendBulkMessage([
        // {
        //   token: "ExponentPushToken[mn1etSOV8gRoj0sNXQ4_0o]",
        //   title: "Test notification from server",
        //   description: "This is test notification from the server",
        //   data: {},
        // },
        {
          token:
            "eLIXSX4Uatv-1QLpe6XrQ_:APA91bFHpg-NYd0kuWoDKE14GEjm7PH6DInZDkHsM5E-N4Srh6bf9542dkIneuy-MuKXdhEq2Rmz8_Cb_fOAiK9UrEx_Tk76AqJ9rYuPg7mEgComi5Jm8SwcBQzcOxbUZPLFrljbsPDU",
          title: "Test notification from server",
          description: "This is test notification from the server",
          data: {},
          isPush:true
        },
      ]);
      resolve(true);
    });
  }

  async createNotif(req, res) {
    console.log("in create notif");
    //this.testExpoNotification();
    this.NotifTest().then((result) => {
      return res
        .status(200)
        .json({ status: 200, message: "Notification created successfully" });
    });
  }

  async getAll(req, res) {
    let queryCreate = {};
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    console.log("employee", req.user.role == "employee", req.query);
    if (req.user.role == "employee") {
      queryCreate = { employeeId: mongoose.Types.ObjectId(req.user._id) };
    }
    console.log(queryCreate);
    try {
      if (req.user.isAdmin) {
        const notifications = await Notification.find({
          type:
            req.query && req.query.type ? req.query.type : "adminnotification",
        }).sort({ createdAt: -1 });
        // if(notifications== '') {
        //   return res.json({ status: 200, message: "No Notification",  data: {} });
        // }
        return res
          .status(200)
          .json({ status: 200, message: "Notification", data: notifications });
      }
      else {
        const notifications = await Notification.find({
          breederId: breederId,
          type:
            req.query && req.query.type === "breeder"  ? 
            ["adminstaffnotification","staffnotification"] : req.query.type ? req.query.type : "staffnotification",
          ...queryCreate,
        }).sort({ createdAt: -1 });
        // if(notifications== '') {
        //   return res.json({ status: 200, message: "No Notification",  data: {} });
        // }
        return res
          .status(200)
          .json({ status: 200, message: "Notification", data: notifications });
      }
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Notification",
        errors: err,
        data: {},
      });
    }
  }

  // Notificaiton routes...

  //breeder create notifications
  async addNotification(req, res) {
    console.log(req.body);
    const { errors, isValid } = validateNotificationInput(req.body);
    // Check validation
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }
    try {
      if (req.user.role.includes("breeder")) {
        if (req.body.employees === "all") {
          // userController.getAllEmployeesOfBreeder(req.user._id).then(allEmployees => {
          // allEmployees.map((employee) => {
          //   this.create(employee._id, 'mynotification',  'employee', 'Employee Registered Successfully', 'You have registered a new employee', req.user._id, null, success.data._id, req.user.deviceToken, true).then(resultNotifCreate => { });
          // });

          User.find({ breederId: req.user._id, role: "employee" })
            .then((allEmployees) => {
              // console.log(allEmployees);

              // const d = {
              //   deviceToken,
              //   title,
              //   description,
              //   data,
              //   userId,
              //   breederId,
              //   notificationType,
              //   animalIdoremployeeId,
              // }

              const data = allEmployees
                .map((e) => e.toObject())
                .map((e) => ({
                  ...e,
                  title: req.body.title,
                  description: req.body.description,
                  userId: req.user._id,
                  breederId: req.user._id,
                  notificationType: req.body.notificationType,
                  notificationSubType: req.body.notificationSubType,
                  data: {},
                  employeeId: e._id,
                  // ...(req.body.notificationType === "animal" ? {animalId: } : {}),
                  // ...(req.body.notificationType === "employee" ? employeeId : {}),
                }));
              //console.log(data);

              this.createMultiple(data, true)
                .then((resultNotif) => {
                  return res.status(200).json({
                    status: 200,
                    message: "Notification created successfully",
                  });
                })
                .catch((error) => {
                  console.log(error);
                });

              // this.sendNotifToAllEmployees(
              //   allEmployees,
              //   req.body.title,
              //   req.body.description,
              //   req.user._id,
              //   true
              // ).then((allOk) => {
              //   console.log(allOk);
              //   return res.status(200).json({
              //     status: 200,
              //     message: "Notification created successfully",
              //   });
              // });
            })
            .catch((error) => {});
        } else {
          this.sendNotifToAllEmployees(
            employees,
            req.body.title,
            req.body.description,
            req.user._id
          ).then((allOk) => {
            console.log(allOk);
            return res.status(200).json({
              status: 200,
              message: "Notification created successfully",
            });
          });
        }
      } else {
      }
      // const notifications= await new Notification(req.body)
      // const doc=await notifications.save()
      // return res.status(200).json({ status: 200, message: "Notification created successfully", data: doc });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in creating Notification",
        errors: err,
        data: {},
      });
    }
  }

  //breeder reminders
  async reminderNotificationUpdated(req, res) {
    console.log(req,"req reminderNotificationUpdated")
    try {
      let allEmployees, tokens;
      if (req.assignToType === "Group") {
        req.animalId = req.groupId.map((e) => e.animals.map((e) => e.id))[0];
        //console.log("-->>",req.groupId.map(e=> e.employees.map(e => e.id))[0])
        allEmployees = req.groupId.map((e) => e.employees.map((e) => e.id))[0];
        tokens = await User.find({
          _id: { $in: allEmployees },
        }).then((result) => result.map((e) => e.deviceToken));
      } else if (req.assignToType === "Animal") {
        allEmployees = req.employeeId.map((e) => e._id);
        tokens = req.employeeId.map((e) => e.deviceToken);
      } else {
        return;
      }
      const data = {
        title: req.categoryName,
        message: `${req.categoryName} activity needs to be done (scheduled after ${req.remainingTime ? req.remainingTime : 10} min)`,
        description: req.description,
        userId: req.breederId,
        breederId: req.breederId,
        notificationType: "employee",
        notificationSubType: "reminder",
        categoryType: req.categoryType,
        assignToType: req.assignToType,
        animalId: req.animalId,
        employeeId: allEmployees,
        groupId: req.groupId.map((e) => e._id),
        categoryName: req.categoryName,
        pending:true,
        categoryId:req.categoryId,
        addedBy:req.breederId,
      };


      try {
        const activity = await new ActivityHistory(data);
        await activity.save();
      } catch (err) {
        console.log(err,"<--error Activity created")
      }

      // sendBulkMessage(
        tokens.map((e) => (
          sendSingleMessage2({
          token: e,
          title: data.title,
          description: data.message ? data.message : data.description,
          data: data,
          isPush: true,
        }))
      );

      // await this.ExpoNotification(tokens, data);
      try {
        //console.log("data==>>",data,data.notificationSubType)
        const notification = await new Notification(data);
        await notification.save();
        console.log("Reminder Notification created successfully");
      } catch (err) {
        console.log("Reminder Notification error", err);
      }
    } catch (err) {
      console.log("Reminder error", err);
    }
  }

  //breeder and admin create notifications
  async addNotificationUpdated(req, res) {
    console.log(req.body);
    const { errors, isValid } = validateNotificationInput(req.body);
    // Check validation
    if (!isValid) {
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }
    try {
      // if (req.user.role.includes("breeder")) {
        let allUsers;
        if (req.body.users === "all") {
          if(req.user.isAdmin) {
            allUsers = await User.find({
              role: "breeder",
            });
          } else {
            allUsers = await User.find({
              breederId: req.user._id,
              role: "employee",
            });
          }
         
        } else {
          allUsers = await User.find({ _id: {$in: req.body.users} });
        }
        const data = {
          title: req.body.title,
          description: req.body.description,
          userId: req.user._id,
          breederId: req.user._id,
          notificationType: req.body.notificationType,
          notificationSubType: req.body.notificationSubType,
          type: req.body.type,
        };
        let usersId = allUsers.map(e=> e.toObject());
        let tokens = allUsers.map(e=> e.toObject()).map((e) => e.deviceToken);
        console.log(usersId);
        if(req.user.isAdmin) {

          this.createMultiple(usersId.map(e => ({...data, breederId: e._id, deviceToken: e.deviceToken, data: data})), true).then(notificationResult => {
            return res
            .status(200)
            .json({
              status: 200,
              message: "Notification created successfully",
            });
          }).catch(error => {
            console.log(error);
            return res.json({
              status: 400,
              message: "Notification created error",
              errors: error,
              data: {},
            });
          })
          
        } else {
          // sendBulkMessage(
            tokens.map((e) => (
              sendSingleMessage2({
              token: e,
              title: data.title,
              description: data.message ? data.message : data.description,
              data: data,
              isPush: true,
            }))
          );
          // push notificaiton
          //await this.ExpoNotification(tokens, data);
          // ##########################

          try {
            const notification = await new Notification({
              ...data,
              ...{ employeeId: usersId.map(e => e._id) },
            });
            const doc = await notification.save();
            return res
              .status(200)
              .json({
                status: 200,
                message: "Notification created successfully",
                data: doc,
              });
          } catch (err) {
            return res.json({
              status: 400,
              message: "Notification created error",
              errors: err,
              data: {},
            });
          }
        }
        
      // } else {
      //   if(req.user.isAdmin) {

      //   } else {
      //     console.log("admin");
      //     return;
      //   }
      // }
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in creating Notification",
        errors: err,
        data: {},
      });
    }
  }

  async ExpoNotification(tokens, data) {
    console.log("ExpoNotification");
    let expo = new Expo();
    let messages = [];
    console.log("tokens==>>", tokens);
    //let arrayOfTokens=["ExponentPushToken[mn1etSOV8gRoj0sNXQ4_0o]","ExponentPushToken[KTCVnDN-dNjqLlD02M3xuR]"]
    for (let pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: "default",
        title: data.title,
        body: data.message ? data.message : data.description,
        data: data,
      });
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          // console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }

  async updateReadbyId(req,res){
    console.log(req.params.id,"updateReadbyId")
    try {
        const notification = await Notification.updateOne({_id:req.params.id}, {$set: {status: "read" }}, { new: true });
        return res.status(200).json({ status: 200, message: "Notification read successfully", data: notification });
    } catch (err) {
        return res.json({ status: 400, message: "Error in read Notification", errors: err, data: {} });
    }
  }

  async deletebyId(req,res){
    try {
        const notification = await Notification.deleteOne({_id:req.params.id});
        return res.status(200).json({ status: 200, message: "Notification deleted successfully", data: notification });
    } catch (err) {
        return res.json({ status: 400, message: "Error in deleting Notification", errors: err, data: {} });
    }
}

}

module.exports = new NotificationController();
