import express from 'express';
import Razorpay from 'razorpay';
import 'dotenv/config.js';
import crypto from 'crypto';
import Payment from '../models/payment.js';

const router = express.Router();

// ROUTE 1
router.get('/get-payment', (req, res) => {
  res.json('Payment Details');
});

console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Razorpay Secret:', process.env.RAZORPAY_SECRET);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ROUTE 1: Create Order API  for payment using post  method
router.post('/order', (req, res) => {
  console.log(req.body);

  const { amount } = req.body;
  try {
    const options = {
      amount: Math.round(amount * 100), // Ensure amount is an integer
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error('Razorpay API Error:', error); // Log detailed error
        return res.status(500).json({ message: 'Something went wrong', error });
      }
      console.log(order);
      res.status(200).json({
        data: order,
      });
    });
  } catch (error) {
    console.error('Unexpected Error:', error); // Log unexpected errors
    res.status(500).json({ message: 'Internal Server Error!' });
  }
});

// ROUTE 2 : Create Verify Api Using POST Method http://localhost:4000/api/payment/verify
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // console.log("req.body", req.body);

  try {
    // Create Sign
    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // console.log(razorpay_signature === expectedSign);

    // Create isAuthentic
    const isAuthentic = expectedSign === razorpay_signature;

    // Condition
    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Save Payment
      await payment.save();

      // Send Message
      res.json({
        message: 'Payement Successfully',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error!' });
    console.log(error);
  }
});

export default router;
