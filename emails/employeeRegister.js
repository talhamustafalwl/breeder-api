module.exports = (breederId, username, password) => {
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
            <p class="heading">Welcome to Logly</p>	
            <p class="primaryText">HELLO ${username}</p>	
            <p class="underline seventy grey">YOU HAVE BEEN REGISTERED AS EMPLOYEE IN LOGLY. WELCOME TO OUR CIRCLE OF LOVE</p>	

            <p class="heading">Breeder Id: <b>${breederId}</b></p>
            <p class="heading">User Id: <b>${username}</b></p>
            <p class="heading">Password: <b>${password}</b></p>
           
            <p class="grey">LOVE LOTS, LOGLY</p>
            <p class="grey">If you have any questions, please email us at</p>
            <p class="grey">hello@logly.us</p>
            <img src="https://i.ibb.co/dDk7vpR/Logo-Logly-colour.png" alt="LOGLY" width="250" height="75">
            </div>
         </div>
         </div>
       </body>
    </html>
    `;
};