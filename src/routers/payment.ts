// @ts-nocheck
import Router from "express";

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
    path: `/transaction/verify/:${reference}`,
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
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
});

export default router;
