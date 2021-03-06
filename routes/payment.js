const express = require('express')
const router = express.Router()

const PaymentController = require('../controllers/PaymentController')

router
  .post('/transactions', PaymentController.transactions)
  .get('/cancel/:orderid', PaymentController.cancel)
  .get('/status/:orderid', PaymentController.status)
  .post('/webhook', PaymentController.webhook)


module.exports = router