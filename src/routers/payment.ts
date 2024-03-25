// @ts-nocheck
import Router from 'express';

const router = Router();
const https = require('https')

router.post('/payment', function(req, res){
  const { email, amount } = req.body;
    // const https = require('https') 

const params = JSON.stringify({
  // "email": req.query.email,
  // "amount": req.query.amount, 
  // "amount": 10000,
  email, amount
})

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
}

const reqPaystack = https.request(options, respaystack => {
  let data = ''

  respaystack.on('data', (chunk) => {
    data += chunk
  });

  respaystack.on('end', () => {
    res.send(data)
    console.log(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})

reqPaystack.write(params)
reqPaystack.end()
})




export default router;