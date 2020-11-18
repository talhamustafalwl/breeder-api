module.exports = (username, password) => {
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
            Congratulations!
            <br/><br/>
            You have been added as breeder in logly:
            User Name: <b>${username}</b>
            <br/>
            Password: <b>${password}</b>
            <br/><br/>
            Have a pleasant day.


               </div>
       </body>
    </html>
    `;
};