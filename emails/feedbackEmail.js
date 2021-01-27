module.exports = (data ) => {
    const today = new Date();
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>FeedBack</title>
         
       </head>
       <body>
          <div class="invoice-box">
          <h3>Date: ${`${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}.`}</h3>
          <br/><br/>
          <b>Name : ${data.firstname} ${data.lastname}</b>
          <br/>
          <b>Email : ${data.email}</b>
          <br/>
          <b>Phone : ${data.phone}</b>
          <br/>
          <b>Message : ${data.message}</b>
          <br/>


               </div>
       </body>
    </html>
    `;
};