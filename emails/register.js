module.exports = (secretToken,Servername) => {
    const today = new Date();
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Please verify your email</title>
         
       </head>
       <body>
          <div class="invoice-box">
          <h3>Date: ${`${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}.`}</h3>

             Hi there,
            <br/>
            Thank you for registering!
            <br/><br/>
            Please verify your email:
            <br/>
            Token: <b>${secretToken}</b>
            <br/>
            <a href="${Servername}/user/verify/${secretToken}">verify</a>
            <br/><br/>
            Have a pleasant day.


               </div>
       </body>
    </html>
    `;
};