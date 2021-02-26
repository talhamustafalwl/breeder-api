module.exports = (email, Servername,type, body, files,charityUrl) => {
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
          <h3>Name: ${body.name}</h3>
          <h3>Care Giver ID: ${body.uid}</h3>
          <h3>Email: ${email}</h3>
          <h3>Business Name: ${body.business}</h3>
          <h3>Phone: ${body.phone}</h3>
          
          <br/>

            Hi Admin,
            <br/>
            New Breeder has registered on Charity Account.
            <br/><br/>
            <h2>Documents Submitted for review:</h2>
            ${` ${files.map(e => 
             `<br> <a href=${charityUrl}${e.filename}>${e.filename}</a></br> `
            )} `
            }
          
            <br/>

            </div>
       </body>
    </html>
    `;
};