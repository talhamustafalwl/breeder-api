const moment = require('moment');
module.exports = (Servername, invoice) => {
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
          <title>Sale Invoice Reminder</title>
         
       </head>
       <body>
          <div class="invoice-box">
            <div>
            <img src="https://i.ibb.co/fndTtxK/Header.png" class="hero-image" alt="LOGLY"></img>
            <div style="text-align:center; justify-content:center">
            <p class="heading">Welcome to Logly</p>
            <p class="primaryText">INVOICE REMINDER </p>

            <p class="primaryText">Date: ${`${moment(invoice.installmentId ? invoice.installmentId.date : invoice.createdAt).format("DD/MM/YYYY")}`}</p>
            <h3>Sales Details: </h3>
            <p class="primaryText">Invoice Number: ${`${invoice.invoiceNumber}`}</p> , 
            <p class="primaryText">Amount Need to be paid: $ ${`${invoice.installmentId ? invoice.installmentId.amount : invoice.saleId.price}`}</p>

            <br/>
            <p class="primaryText">Sale Id: ${`${invoice.saleId.saleUniqueId}`}</p> , 
            <p class="primaryText">Total Price of Sale: $ ${`${invoice.saleId.totalPrice}`}</p>
            <a href=${Servername}/sales class="Refbtn">SEE DETAIL</a>
            </div>
         </div>
         </div>
       </body>
    </html>
    `;
};