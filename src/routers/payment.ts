import { Router } from 'express';
import https from 'https';

const router = Router();

router.post('/payment', (req, res) => {
  const { email, amount } = req.body;

  const paymentParams = JSON.stringify({
    email,
    amount
  });

  const paymentOptions = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const paymentRequest = https.request(paymentOptions, respaystack => {
    let paymentData = '';

    respaystack.on('data', (chunk) => {
      paymentData += chunk;
    });

    respaystack.on('end', () => {
      // Handle payment initialization response
      const responseData = JSON.parse(paymentData);
      // Check if payment initialization was successful
      if (responseData.status) {
        // Perform operations upon successful payment initialization
        // For example, you can redirect the user to the payment URL
        res.redirect(responseData.authorization_url);
      } else {
        // Handle payment initialization failure
        res.status(500).json({ error: 'Failed to initialize payment' });
      }
    });
  });

  paymentRequest.on('error', error => {
    console.error(error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  });

  paymentRequest.write(paymentParams);
  paymentRequest.end();
});

router.get('/payment/verify/:reference', (req, res) => {
  const reference = req.params.reference;

  const verifyOptions = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    }
  };

  const verifyRequest = https.request(verifyOptions, verifyResponse => {
    let verifyData = '';

    verifyResponse.on('data', (chunk) => {
      verifyData += chunk;
    });

    verifyResponse.on('end', () => {
      // Handle payment verification response
      const responseData = JSON.parse(verifyData);
      // Check if payment verification was successful
      if (responseData.status && responseData.data.status === 'success') {
        // Perform operations upon successful payment verification
        // For example, you can create an entry in the orders table
        // and send a response indicating successful payment verification
        // Example: createOrder(responseData.data);
        res.status(200).json({ message: 'Payment verified successfully' });
      } else {
        // Handle payment verification failure
        res.status(400).json({ error: 'Failed to verify payment' });
      }
    });
  });

  verifyRequest.on('error', error => {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify payment' });
  });

  verifyRequest.end();
});

export default router;
