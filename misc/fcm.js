var FCM = require("fcm-node");
var serverKey =
  "AAAAcGS8-Oc:APA91bGgNNYuO_02fEvMopMOlVhjv8UxkJKPj-KKDqZcZaibPz6cWHLqVUnbN6__9ydECcwcN4OREdqT8RGAKIWBWQChXL42e1F3X7TIadi0Sk82-qZZa8sgHJ4SDKIuf1Gh_8jdXYUQ";

var fcm = new FCM(serverKey);

module.exports.sendMessage = (token, title, description, data) => {
  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,
    // collapse_key: 'your_collapse_key',
    notification: {
      title: title,
      body: description,
      content_available: true,
    },

    data,
  };
  console.log(message);
  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

module.exports.sendBulkMessage = (data = []) => {
  console.log("in send bulk messages ===> ");
  console.log(data);
  data.forEach((value) => {
    console.log(value, "<--value");
    if (value.isPush) {
      console.log(value, "<--value");
      this.sendMessage(value.token, value.title, value.description, value.data);
    }
  });
  return;
};

module.exports.sendSingleMessage = (value) => {
  this.sendMessage(value.token, value.title, value.description, value.data);
  return;
};

module.exports.sendSingleMessage2 = (value) => {
  console.log(value, "<---??");
  this.sendMessage(value.token, value.title, value.description, value.data);
  return;
};
