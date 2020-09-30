require('dotenv').config()

const { Payment,Order } = require("../models")
const response = require('../helpers/response')

const midtransClient = require('midtrans-client');


let apiClient = new midtransClient.Snap({
        isProduction : false,
        serverKey : process.env.MIDTRANS_SERVER_KEY,
        clientKey : process.env.MIDTRANS_CLIENT_KEY 
    });




class PaymentController {

  static async transactions(req, res){

    try {

      // example transactions Data
      // {
      //   "id_table_order": 1,
      //   "transaction_details": {
      //     "order_id": "ORDER-103-{{$timestamp}}",
      //     "gross_amount": 30000
      //   },
      //   "credit_card": {
      //     "secure": true
      //   },
      //   "item_details": [{
      //     "id": "ITEM5",
      //     "price": 10000,
      //     "quantity": 3,
      //     "name": "pakaian dalam"
      //   }],
      //   "customer_details": {
      //     "first_name": "TEST",
      //     "last_name": "MIDTRANSER",
      //     "email": "noreply@example.com",
      //     "phone": "+628123456",
      //     "billing_address": {
      //       "first_name": "TEST",
      //       "last_name": "MIDTRANSER",
      //       "email": "noreply@example.com",
      //       "phone": "081 2233 44-55",
      //       "address": "Sudirman",
      //       "city": "Jakarta",
      //       "postal_code": "12190",
      //       "country_code": "IDN"
      //     },
      //     "shipping_address": {
      //       "first_name": "TEST",
      //       "last_name": "MIDTRANSER",
      //       "email": "noreply@example.com",
      //       "phone": "0812345678910",
      //       "address": "Sudirman",
      //       "city": "Jakarta",
      //       "postal_code": "12190",
      //       "country_code": "IDN"
      //     }
      //   }
      // }

    //   example transactions full
    //   {
    //     "id_table_order": 1,
    //   "transaction_details": {
    //     "order_id": "ORDER-105-{{$timestamp}}",
    //     "gross_amount": 10000
    //   },
    //   "item_details": [{
    //     "id": "ITEM1",
    //     "price": 10000,
    //     "quantity": 1,
    //     "name": "Midtrans Bear",
    //     "brand": "Midtrans",
    //     "category": "Toys",
    //     "merchant_name": "Midtrans"
    //   }],
    //   "customer_details": {
    //     "first_name": "John",
    //     "last_name": "Watson",
    //     "email": "test@example.com",
    //     "phone": "+628123456",
    //     "billing_address": {
    //       "first_name": "John",
    //       "last_name": "Watson",
    //       "email": "test@example.com",
    //       "phone": "081 2233 44-55",
    //       "address": "Sudirman",
    //       "city": "Jakarta",
    //       "postal_code": "12190",
    //       "country_code": "IDN"
    //     },
    //     "shipping_address": {
    //       "first_name": "John",
    //       "last_name": "Watson",
    //       "email": "test@example.com",
    //       "phone": "0 8128-75 7-9338",
    //       "address": "Sudirman",
    //       "city": "Jakarta",
    //       "postal_code": "12190",
    //       "country_code": "IDN"
    //     }
    //   },
    //   "enabled_payments": ["credit_card", "mandiri_clickpay", "cimb_clicks","bca_klikbca", "bca_klikpay", "bri_epay", "echannel","mandiri_ecash", "permata_va", "bca_va", "bni_va", "other_va", "gopay", "indomaret", "alfamart", "danamon_online", "akulaku"],
    //   "credit_card": {
    //     "secure": true,
    //     "bank": "bca",
    //     "installment": {
    //       "required": false,
    //       "terms": {
    //         "bni": [3, 6, 12],
    //         "mandiri": [3, 6, 12],
    //         "cimb": [3],
    //         "bca": [3, 6, 12],
    //         "offline": [6, 12]
    //       }
    //     },
    //     "whitelist_bins": [
    //       "48111111",
    //       "41111111"
    //     ]
    //   },
    //   "bca_va": {
    //     "va_number": "12345678911",
    //     "sub_company_code": "00000",
    //     "free_text": {
    //       "inquiry": [
    //         {
    //           "en": "text in English",
    //           "id": "text in Bahasa Indonesia"
    //         }
    //       ],
    //       "payment": [
    //         {
    //           "en": "text in English",
    //           "id": "text in Bahasa Indonesia"
    //         }
    //       ]
    //     }
    //   },
    //   "bni_va": {
    //     "va_number": "12345678"
    //   },
    //   "permata_va": {
    //     "va_number": "1234567890",
    //     "recipient_name": "SUDARSONO"
    //   },
    //   "callbacks": {
    //     "finish": "https://demo.midtrans.com"
    //   },
    //   "expiry": {
    //     "start_time": "2020-12-13 18:11:08 +0700",
    //     "unit": "minutes",
    //     "duration": 1
    //   },
    //   "custom_field1": "custom field 1 content",
    //   "custom_field2": "custom field 2 content",
    //   "custom_field3": "custom field 3 content"
    // }

        let parameter = JSON.stringify(req.body)
        let transaction = await apiClient.createTransaction(parameter);

        let transactionToken = transaction.token;
        let redirectUrl = transaction.redirect_url;
        console.log('transactionToken:',transactionToken);

        const payment = await Payment.create({
          idOrder: req.body.transaction_details.order_id,
          status: "idle",
          token: transactionToken
        })

        const order = await Order.update({
          idPayment: payment.id
        }, {
          where: {
            id: req.body.id_table_order
          }
        })

        return res.status(200).json(response("Success", "response", {token: transactionToken}))
    
       
      } catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
      }
  }

  static async webhook(req, res){
    try {
      console.log("masuk webhook")
    apiClient.transaction.notification(req.body)
    .then(async (statusResponse)=>{
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;
        let status = '';
        
        if (transactionStatus == 'capture'){
            // capture only applies to card transaction, which you need to check for the fraudStatus
            if (fraudStatus == 'challenge'){
                // TODO set transaction status on your databaase to 'challenge'
                status = 'challenge'
            } else if (fraudStatus == 'accept'){
                // TODO set transaction status on your databaase to 'success'
                status = 'success'
                

            }
        } else if (transactionStatus == 'settlement'){
            // TODO set transaction status on your databaase to 'success'
            status = 'success'
        } else if (transactionStatus == 'deny'){
            // TODO you can ignore 'deny', because most of the time it allows payment retries
            // and later can become success
        } else if (transactionStatus == 'cancel' ||
          transactionStatus == 'expire'){
            // TODO set transaction status on your databaase to 'failure'
            status = 'failure'
        } else if (transactionStatus == 'pending'){
            // TODO set transaction status on your databaase to 'pending' / waiting payment
            status = 'pending'
        }

        await Payment.update({
          status: status
        }, {
          where: {
              idOrder: orderId
          }
        })

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);


    });


    } catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
      }
    
  }

  // cancel a credit card transaction or pending transaction
  static async cancel(req, res){
    try{
        let respon = await apiClient.transaction.cancel(req.params.orderid)
        return res.status(200).json(response("Success", "cancel transactions", {respon}))

        // example respon
        // "status_code": "200",
        // "status_message": "Success, transaction is canceled",
        // "transaction_id": "fd6379b9-a16a-49fd-8f67-72f6c1c54648",
        // "order_id": "ORDER-555-1601488076",
        // "merchant_id": "G636395651",
        // "gross_amount": "10000.00",
        // "currency": "IDR",
        // "payment_type": "bank_transfer",
        // "transaction_time": "2020-10-01 00:50:19",
        // "transaction_status": "cancel",
        // "fraud_status": "accept"
    }
    catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
    }
  }

  static async status(req, res){
    try{
      let respon = await apiClient.transaction.status(req.params.orderid);
      return res.status(200).json(response("Success", "status transactions", respon))

      // example respon
      // {"payment_type": "echannel",
      // "bill_key": "338867864569",
      // "biller_code": "70012",
      // "transaction_time": "2020-10-01 00:25:10",
      // "gross_amount": "10000.00",
      // "currency": "IDR",
      // "order_id": "ORDER-555-1601486513",
      // "signature_key": "ebc98335b07b84702800f1cbb04104d6bb1773dd8ea8f2a5fd50d8876061cedb53f4d4f6f64e0fb7b16dd5feb5224537c3b733b9a54aecc76160204bed51d68b",
      // "status_code": "200",
      // "transaction_id": "44e69f42-7a7e-4414-ab27-b33f8d4f1b66",
      // "transaction_status": "cancel",
      // "fraud_status": "accept",
      // "status_message": "Success, transaction is found",
      // "merchant_id": "G636395651"}

    }
    catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
    }
  }

  static async challange(req, res){
    try{
      if(req.params.kind == 'approve'){

        let respon = await apiClient.transaction.approve(req.params.orderid)
        return res.status(200).json(response("Success", "approve challange", {respon}))
      }
      else if(req.params.kind == 'deny'){

        // deny a credit card transaction with `challenge` fraud status
        let respon = await apiClient.transaction.deny(req.params.orderid)
        return res.status(200).json(response("Success", "deny challange", {respon}))

      }
      else{
        return res.status(400).json(response("Failed", "not found params kind", {}))
      }

    }
    catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
    }
  }

  // approve a credit card transaction with `challenge` fraud status




}

module.exports = PaymentController