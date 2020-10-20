const { sendMessage, sendBulkMessage } = require("../misc/fcm");
const { Notification } = require("../models/Notification/Notification");
const { User } = require("../models/User");

const { validateNotificationInput } = require("../validation/notification");
const userController = require("./user.controller");

class NotificationController {
  constructor() {
    this.createNotif = this.createNotif.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.sendNotifToAllEmployees = this.sendNotifToAllEmployees.bind(this);
  }

  // 'd1t1kZ7AxBM_tVAS1Wo_ry:APA91bFfOs5E5tCGyoDKVHEUR3-uSzaHTYgi_fkV7naWXLvAHKxJEOa1niuLTVVQYqdDawBMN_nJg8qMj9y_Oih_y8bI5nscg1YxWx9xsZflp1Vvbbz8ytUQW8Zo-9_FSn6jJkXdDXtv'
  // userId, type, description, isPush
  async create(
    userId,
    type,
    notificationType,
    title,
    description,
    breederId,
    animalId,
    employeeId,
    userToken,
    isPush
  ) {
    return new Promise(async (resolve, reject) => {
      sendMessage(userToken, title, description, { count: 1 });

      const data = {
        ...{ userId, title, type, notificationType, breederId, description },
        ...(notificationType === "animal" ? animalId : {}),
        ...(notificationType === "employee" ? employeeId : {}),
      };

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

  async NotifTest() {
    return new Promise(async (resolve, reject) => {
      sendBulkMessage([
        {
          token:
            "fNrQ4OAkiXQQ16yftO2Nun:APA91bHt_qs8M8-L8r6icE1lDJgxNr3lACP93EoUQPr125JPULT0E3K2d0E8R7_ugf8yPYK-v1zTvzR8RTAfw2IfzJGGrUmLDrtJN5ljA8I00dpAjIUg1B4ryYQOmkmYBx-vbd4o-u8m",
          title: "Test notification from server",
          description: "This is test notification from the server",
          data: {},
        },
        {
          token:
            "fNrQ4OAkiXQQ16yftO2Nun:APA91bHt_qs8M8-L8r6icE1lDJgxNr3lACP93EoUQPr125JPULT0E3K2d0E8R7_ugf8yPYK-v1zTvzR8RTAfw2IfzJGGrUmLDrtJN5ljA8I00dpAjIUg1B4ryYQOmkmYBx-vbd4o-u8m",
          title: "Test notification from server",
          description: "This is test notification from the server",
          data: {},
        },
      ]);
      resolve(true);
    });
  }

  async createNotif(req, res) {
    console.log("in create notif");
    this.NotifTest().then((result) => {
      return res
        .status(200)
        .json({ status: 200, message: "Notification created successfully" });
    });
  }




 

  //breeder create notifications
  async addNotification(req, res) {
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

          User.find({ breederId, role: "employee" })
            .then((allEmployees) => {
              // console.log(allEmployees);
              this.sendNotifToAllEmployees(
                allEmployees,
                req.body.title,
                req.body.description,
                req.user._id,
                true
              ).then((allOk) => {
                console.log(allOk);
                return res
                  .status(200)
                  .json({
                    status: 200,
                    message: "Notification created successfully",
                  });
              });
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
            return res
              .status(200)
              .json({
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








  async createMultiple( userId,
    type,
    notificationType,
    title,
    description,
    breederId,
    animalId,
    employeeId,
    userToken,
    isPush) {
    return new Promise(async (resolve, reject) => {
      sendMessage(userToken, title, description, { count: 1 });

      const data = {
        ...{ userId, title, type, notificationType, breederId, description },
        ...(notificationType === "animal" ? animalId : {}),
        ...(notificationType === "employee" ? employeeId : {}),
      };

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



  async sendNotifToAllEmployees(
    employees,
    title,
    description,
    breederId,
    multiple = false
  ) {
    if (multiple) {
      console.log("multiple");


      // const empForNotification = employees.map(emp => (
      //   {
      //     token: emp.deviceToken, 
      //     title: "Test notification from server",
      //     description: "This is test notification from the server",
      //     data: {},
      //   }
      // ));

      const notifSend = await Promise.all(
        employees.map(async (emp) => {
          this.create(
            emp._id,
            "mynotification",
            "employee",
            title,
            description,
            breederId,
            null,
            emp._id,
            emp.deviceToken,
            true
          )
            .then((resultemp) => {
              return resultemp;
            })
            .catch((error) => {
              console.log(error);
              return;
            });
        })
      );
      return notifSend;
    } else {
      return new Promise((resolve, reject) => {
        this.create(
          employees._id,
          "mynotification",
          "employee",
          title,
          description,
          breederId,
          null,
          employees._id,
          employees.deviceToken,
          true
        )
          .then(resolve)
          .catch(reject);
      });
    }
  }

  async getAll(req, res) {
    try {
      const notifications = await Notification.find({
        userId: req.user._id,
        type: req.query.type,
      });
      if (notifications == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Notification", data: notifications });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Notification",
        errors: err,
        data: {},
      });
    }
  }

  async getbyId(req, res) {
    try {
      const notifications = await Notification.find({ _id: req.params.id });
      if (notifications == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Notification", data: notifications });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in get Notification",
        errors: err,
        data: {},
      });
    }
  }

  async deletebyId(req, res) {
    try {
      const notifications = await Notification.deleteOne({
        _id: req.params.id,
      });
      return res
        .status(200)
        .json({
          status: 200,
          message: "Notification deleted successfully",
          data: notifications,
        });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Notification",
        errors: err,
        data: {},
      });
    }
  }

  async updatebyId(req, res) {
    try {
      const notifications = await Notification.updateOne(
        { _id: req.params.id },
        req.body
      );

      return res
        .status(200)
        .json({
          status: 200,
          message: "Notification updated successfully",
          data: notifications,
        });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Notification",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new NotificationController();
