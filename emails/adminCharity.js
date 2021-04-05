module.exports = (email, Servername, type, body, files, charityUrl) => {
   const today = new Date();
   return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
           <style>
            body, html {
            height: 100%;
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            }

            .hero-image {
            height: 35%;width:100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
            }
            .Refbtn{
            text-decoration: none;font-weight:bolder;
            background-color:#fdd656;color:#503a9f;
            padding: 10px 15px 10px 15px;border-radius:5px
            }
            .primaryText{
            font: bolder;color:#503a9f;font-size:25px
            }

            .underline {
            border-bottom:2.5px solid grey; padding-bottom:20px
            }
            .seventy{
               width:80%;margin-left:10%
            }
            .grey{
            color:grey
            }
            .heading{
            font-family:garamond;font: bolder;font-size:25px
            }
            </style>
          <title>Please verify your email</title>
         
       </head>
       <body>
          <div class="invoice-box">
           <div>
            <img src="https://i.ibb.co/fndTtxK/Header.png" class="hero-image" alt="LOGLY"></img>
            <div style="text-align:center; justify-content:center">
            <p class="underline seventy grey">NEW BREEDER HAVE BEEN REGISTERED ON BREEDER ACCOUNT</p>
            

            <h3>Detail</h3>
            <p class="grey">Name: ${body.name}</p>	
            <p class="grey">Care Giver ID: ${body.uid}</p>
             <p class="grey">Email: ${email}</p>	
            <p class="grey">Business Name: ${body.businessName}</p>	
            <p class="grey">Phone: ${body.phone}</p>
            <br/>

               <p class="grey">Documents Submitted for review:</p>
            <div>
             ${` ${files.map(e =>
      `<br> <a href=${charityUrl}${e.filename}>${e.filename}</a></br> `
   )} `
      }
            </div>
            <br/>

            <p class="grey">LOVE LOTS, LOGLY</p>
            <p class="grey">If you have any questions, please email us at</p>
            <p class="grey">hello@logly.us</p>
            <img src="https://i.ibb.co/QnsWKTg/Logly-Logo.png" alt="LOGLY" width="200" height="50">
            </div>
         </div>
         </div>
       </body>
    </html>
    `;
};