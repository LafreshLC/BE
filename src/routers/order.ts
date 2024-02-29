import { orderDetails } from "#/controller/oder";
import { mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post('/create-order', mustAuth, orderDetails);


export default router;