const moment = require('moment') ;
module.exports = ( Servername, invoice) => {
    const today = new Date();
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Sale Invoice Reminder</title>
         
       </head>
       <body>
          <div class="invoice-box">
          <h3>Date: ${`${moment(invoice.installmentId ? invoice.installmentId.date : invoice.createdAt).format("DD/MM/YYYY")}`}</h3>

            Hi there,
            <br/>
            Your invoice reminder
            <br/><br/>
            <h3>Sales Details: </h3>
            <b>Invoice Number: ${`${invoice.invoiceNumber}`}</b> , 
            <b>Amount Need to be paid: $ ${`${invoice.installmentId ? invoice.installmentId.amount : invoice.saleId.price}`}</b>

            <br/>
            <b>Sale Id: ${`${invoice.saleId.saleUniqueId}`}</b> , 
            <b>Total Price of Sale: $ ${`${invoice.saleId.totalPrice}`}</b>
            <br/>
            <a href="${Servername}/sales">See detail ...</a>
            <br/><br/>
            Have a pleasant day.


               </div>
       </body>
    </html>
    `;
};