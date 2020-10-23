var FCM = require('fcm-node');
var serverKey = 'AAAA5Jnhgq0:APA91bHn5TyzvQQO-pcoEfeM602LvJTCTvoy7cNN0am5zjESSz-m1fltnZkr_7ksaeNdyE9riOsSZRhSkj2ETfc3Oe6BxjRyUMMOPWJIHc5X9sNvODRWtK60p1DhdDvHeCa-O1rFFGOl'; //put your server key here
var fcm = new FCM(serverKey);

module.exports.sendMessage = (token, title, description, data ) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token, 
        // collapse_key: 'your_collapse_key',
        notification: {
            title: title, 
            body: description 
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
    data.forEach(value => this.sendMessage(value.token, value.title, value.description, value.data));
    return;
    // this.sendMessage(token, title, description, data);
    // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //     to: token, 
    //     // collapse_key: 'your_collapse_key',
    //     notification: {
    //         title: title, 
    //         body: description 
    //     },
        
    //     data
    // };
    // console.log(message);
    // console.log(data);
    // data = data.map(d => transformData(d));
    // console.log(data);
    // fcm.send( data , function(err, response) {
    //     if (err) {
    //         console.log(err);
    //         console.log("Something has gone wrong!");
    //     } else {
    //         console.log("Successfully sent with response: ", response);
    //     }
    // });
}


