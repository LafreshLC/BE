import { confirmedOrders, orderDetails, pendingOrders, userOrder } from "#/controller/oder";
import { mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post('/create-order', mustAuth, orderDetails);
router.get('/user-orders', mustAuth, userOrder);
router.get('/pending-orders', pendingOrders);
router.get('/confirmed-orders', confirmedOrders);


export default router;