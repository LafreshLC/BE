import { Router } from "express";
import { addProduct, removeProduct, updateProduct } from "#/controller/product";

const router = Router();
router.post('/create-product', addProduct);
router.post('/update-product', updateProduct);
router.delete('/delete-product', removeProduct);

export default router 