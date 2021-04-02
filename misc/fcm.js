var FCM = require('fcm-node');
var serverKey = "AAAATFUSClk:APA91bG_1iOLfmB35D2Tg400__wbz05E_9txj1AhnuYuLNTFHr-UkzjDSSyUbKLp9cTiigbnSb6stPVXqmEWpeWgbYdgw90P0zaP3ZxC2OBcBeOhmMiGzAPr_QwC6NjvGc8GHozb5pPi"
//'AAAA5Jnhgq0:APA91bHn5TyzvQQO-pcoEfeM602LvJTCTvoy7cNN0am5zjESSz-m1fltnZkr_7ksaeNdyE9riOsSZRhSkj2ETfc3Oe6BxjRyUMMOPWJIHc5X9sNvODRWtK60p1DhdDvHeCa-O1rFFGOl'; //put your server key here
var fcm = new FCM(serverKey);

module.exports.sendMessage = (token, title, description, data ) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token, 
        // collapse_key: 'your_collapse_key',
        notification: {
            title: title, 
            body: description,
            content_available:true
        },
        
        data
    };
    console.log(message);
    fcm.send( message , function(err, response) {
        if (err) {
            console.log(err);
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}




module.exports.sendBulkMessage = (data=[]) => {
    console.log('in send bulk messages ===> ');
    console.log(data);
    data.forEach(value => {
        console.log(value,"<--value");
        if (value.isPush) 
        { console.log(value,"<--value");
            this.sendMessage(value.token, value.title, value.description, value.data)
        }
    });
    return;
}

module.exports.sendSingleMessage = (value) => {
    this.sendMessage(value.token, value.title, value.description, value.data);
    return;
}

module.exports.sendSingleMessage2 = (value) => {
    console.log(value,"<---??")
    this.sendMessage(value.token, value.title, value.description, value.data);
    return;
}
