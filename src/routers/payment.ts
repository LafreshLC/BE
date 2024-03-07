import Router from 'express';

const router = Router();

router.get('/payment', function(req, res){
    // const https = require('https')

const params = JSON.stringify({
  "email": req.query.email,
  "amount": req.query.amount,
})

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: 'Bearer sk_test_0b52e05b3771dd48a0e452dd1517a31dce229299',
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