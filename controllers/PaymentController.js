require('dotenv').config()

const { Payment,Order } = require("../models")
const response = require('../helpers/response')

const axios = require('axios');

const basicAuth = {
    username: process.env.MIDTRANS_USERNAME,
    password: ''
}

const Api = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

class PaymentController {

  static async transactions(req, res){
    const transactions_url = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
    try {
        const result = await Api.post(transactions_url,req.body,{auth: basicAuth});
        const {token, redirect_url} = result.data;

        const payment = await Payment.create({
            idOrder: req.body.transaction_details.order_id,
            status: "idle",
            token: token
          })
        
        const order = await Order.update({
            idPayment: payment.id
          }, {
            where: {
              id: req.body.id_table_order
            }
          })
        
          if(order){
            return res.status(200).json(response("Success", "response", {data: result.data, body: req.body}))
          }
       
      } catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
      }
  }

  static async webhook(req, res){
    try {
        const payment = await Payment.update({
            status: req.body.transaction_status
          }, {
            where: {
                idOrder: req.body.order_id
            }
          })
        
          if(payment){
            res.status(200).json(response("Success", "webhook", req.body))
          }

    } catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
      }
    
  }

  static async cancel(req, res){
    try{
        const cancel_url = `https://api.sandbox.midtrans.com/v2/${req.params.orderid}/cancel`;
        const result = await Api.post(cancel_url,{},{auth: basicAuth});
        if(result){
            return res.status(200).json(response("Success", "cancel order", {data: result.data}))
        }
    }
    catch (error) {
        return res.status(400).json(response("Failed", error.message, {}))
    }
  }

}

module.exports = PaymentController