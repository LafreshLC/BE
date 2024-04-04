import { allOders, confirmedOrders, pendingOrders, userOrder } from "#/controller/oder";
import { mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.get('/user-orders', mustAuth, userOrder);
router.get('/pending-orders', pendingOrders);
router.get('/confirmed-orders', confirmedOrders);
router.get('/total-orders', allOders);


export default router;