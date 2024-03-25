// @ts-nocheck
import Router, { response } from "express";

const router = Router();
const https = require("https");

router.post("/payment", function (req, res) {
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email,
    amount,
    callback_url: "https://lafreshfe.vercel.app/verify",
    // callback_url: "http://localhost:5173/verify",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const reqPaystack = https
    .request(options, (respaystack) => {
      let data = "";

      respaystack.on("data", (chunk) => {
        data += chunk;
      });

      respaystack.on("end", () => {
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  reqPaystack.write(params);
  reqPaystack.end();
});

router.get("/verify", function (req, res) {
  const reference = req.query.reference;
  console.log(reference);
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  };

  const reqPaystack = https
    .request(options, (respaystack) => {
      let data = "";

      respaystack.on("data", (chunk) => {
        data += chunk;
      });

      respaystack.on("end", () => {
        const responseData = JSON.parse(data);
        console.log(responseData); // Log the response for debugging purposes

        // Check if payment was successful
        if (
          responseData.status === true &&
          responseData.data.status === "success"
        ) {
          // Payment was successful, extract relevant information
          const { amount, email, transactionId, name, referenceId, status, currency } = responseData.data;
          const paymentData = {
            referenceId = responseData.data.reference,
            email = responseData.data.customer.email,
            amount = responseData.data.amount,
            status = responseData.data.status,
            currency = responseData.data.currency,
            name = responseData.data.customer.first_name,
            transactionId = responseData.data.id
          }
          console.log(paymentData);
        }
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
  reqPaystack.end();
});

export default router;
