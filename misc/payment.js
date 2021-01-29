const { reject } = require("async");
const config = require("../config/key");
const stripe = require("stripe")(config.stripe_private);
class PaymentSesrvice {
  constructor() {
    this.createSource = this.createSource.bind(this);
  }

  async createPayment(creditCard, amount) {}

  // async createCardToken(number, exp_month, exp_year, cvc) {
  //   const token = await stripe.tokens.create({
  //     card: {
  //       number,
  //       exp_month,
  //       exp_year,
  //       cvc,
  //     },
  //   });
  //   return token;
  // }

  async getCreditCard(cardToken) {
    const token = await stripe.tokens.retrieve(cardToken);
    return token;
  }

  //   Result
  // {
  //     "id": "tok_1HcCXFLWds26JzlySYOMSbdy",
  //     "object": "token",
  //     "card": {
  //       "id": "card_1HcCXFLWds26JzlyBpAryTm3",
  //       "object": "card",
  //       "address_city": null,
  //       "address_country": null,
  //       "address_line1": null,
  //       "address_line1_check": null,
  //       "address_line2": null,
  //       "address_state": null,
  //       "address_zip": null,
  //       "address_zip_check": null,
  //       "brand": "Visa",
  //       "country": "US",
  //       "cvc_check": "unchecked",
  //       "dynamic_last4": null,
  //       "exp_month": 10,
  //       "exp_year": 2021,
  //       "fingerprint": "cnOBaH5uY3Krkqa6",
  //       "funding": "credit",
  //       "last4": "4242",
  //       "metadata": {

  //       },
  //       "name": null,
  //       "tokenization_method": null
  //     },
  //     "client_ip": "110.37.225.2",
  //     "created": 1602691745,
  //     "livemode": false,
  //     "type": "card",
  //     "used": false
  //   }

  async charge(amount, source, customer, description) {
    console.log('in charge ===> ');
    if(amount === 0){
      return
    }
    console.log(amount, source, description);
    return new Promise((resolve, reject) => {
      stripe.charges.create(
        {
          // Convert it to usd
          amount: amount*100,
          currency: "usd",
          source,
          customer, 
          description,
        },
        function (err, token) {
          if (err) reject(err);
          resolve(token);
          // asynchronously called
        }
      );
    });
  }

  async createCustomer(name, email, description) {
    return new Promise(async (resolve, reject) => {
      const customer = await stripe.customers.create({
        name,
        email,
        description,
      });
      resolve(customer);
    });
  }

  async createCardToken(cardId, customerId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await stripe.tokens.create({
          card: cardId,
          customer: customerId,
        }, {
          stripeAccount: 'acct_1Hwq3LPqJceDppFg',
        });
        console.log(token);
        resolve(token);  
      } catch(error) {
        reject(error);
      }
    });
  }


  // ####################################################################
  // {
  //   "id": "tok_1Hvhrl2eZvKYlo2CEKdf3L3m",
  //   "object": "token",
  //   "card": {
  //     "id": "card_1Hvhrl2eZvKYlo2CzwfD5Ot6",
  //     "object": "card",
  //     "address_city": null,
  //     "address_country": null,
  //     "address_line1": null,
  //     "address_line1_check": null,
  //     "address_line2": null,
  //     "address_state": null,
  //     "address_zip": null,
  //     "address_zip_check": null,
  //     "brand": "Visa",
  //     "country": "US",
  //     "cvc_check": "pass",
  //     "dynamic_last4": null,
  //     "exp_month": 8,
  //     "exp_year": 2021,
  //     "fingerprint": "Xt5EWLLDS7FJjR1c",
  //     "funding": "credit",
  //     "last4": "4242",
  //     "metadata": {},
  //     "name": null,
  //     "tokenization_method": null
  //   },
  //   "client_ip": null,
  //   "created": 1607340413,
  //   "livemode": false,
  //   "type": "card",
  //   "used": false
  // }

  async createCreditCardToken(cardNumber, expiryDate, expiryYear, CVC) {
    return new Promise(async (resolve, reject) => {
      const token = await stripe.tokens.create({
        card: {
          number: cardNumber,
          exp_month: expiryDate,
          exp_year: expiryYear,
          cvc: CVC,
        },
      });
      resolve(token);
    });
  }

  async createSource(cardNumber, expiryDate, expiryYear, CVC, customerId) {
    return new Promise(async (resolve, reject) => {
      const creditCardToken = await this.createCreditCardToken(cardNumber, expiryDate, expiryYear, CVC);
      const card = await stripe.customers.createSource(
        customerId,
        {source: creditCardToken.id}
      );
      resolve(card);
    });
   
  }
}

module.exports = new PaymentSesrvice();
