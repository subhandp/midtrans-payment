const express = require('express')
const router = express.Router()

const PaymentController = require('../controllers/PaymentController')

router
  .post('/transactions', PaymentController.transactions)
  .get('/cancel/:orderid', PaymentController.cancel)
  .get('/webhook', PaymentController.webhook)
  .post('/webhook', PaymentController.webhook)


module.exports = router