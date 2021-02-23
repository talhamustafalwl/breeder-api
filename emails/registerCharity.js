module.exports = (secretToken, Servername,type, uid, files,charityUrl) => {
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
          <h3>Care Giver ID: ${uid}</h3>
          <br/>

            Hi there,
            <br/>
            Thank you for registering! (Charity Account)
            <br/><br/>

            Please verify your email:
            <br/>
            <a href=${Servername}/user/verify/${secretToken}>verify</a>
            <br/>
            <br/>
            <br/>
            <h2>Documents Submitted for review:</h2>
            ${` ${files.map(e => 
             `<br> <a href=${charityUrl}${e.filename}>${e.filename}</a></br> `
            )} `
            }
            <br/><br/><br/>
            Instructions here
            <br/>
            Have a pleasant day.


               </div>
       </body>
    </html>
    `;
};