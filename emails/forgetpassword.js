module.exports = (email, Servername, token) => {
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
          <div>
          <h3>Dear ${email},</h3>
          <p>You requested for a password reset, kindly use this <a href="${Servername}/changepassword/${token}">link</a> to reset your password</p>
          <br>
          <p>Cheers!</p>
          

               </div>
       </body>
    </html>
    `;
};